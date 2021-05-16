package gameApp

import (
	"errors"
	"log"
	"net/url"
	"strconv"
	"time"

	"github.com/ChimeraCoder/anaconda"
	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/Mojashi/RicochetRobots/api/twitter"
	"github.com/Mojashi/RicochetRobots/api/utils"
)

type IArenaGameApp interface {
	IBaseGameApp
}

type ArenaGameApp struct {
	*BaseGameApp
	self IArenaGameApp

	twitterApi   twitter.TwitterAPI
	problemTweet *anaconda.Tweet
	solAnimMedia *anaconda.VideoMedia
	nextProblem  chan *model.ProblemWithSolution
}

func NewArenaGameApp(twApi twitter.TwitterAPI, users map[model.UserID]model.User, conf model.GameConfig, output app.IGameOutput, problemRepository repository.IProblemWithSolutionRepository, self IArenaGameApp) *ArenaGameApp {
	g := &ArenaGameApp{
		twitterApi:  twApi,
		self:        self,
		nextProblem: make(chan *model.ProblemWithSolution, 10),
	}
	if self == nil {
		g.self = g
	}
	g.BaseGameApp = NewBaseGameApp(users, conf, output, problemRepository, g.self)
	g.addNextProblem()
	return g
}

func (a *ArenaGameApp) StartProblem() error {
	if !a.GameState.Interval {
		return errors.New("another problem has already been started")
	}

	problem := <-a.nextProblem
	imgPath := "./boardImg.png"
	utils.DrawProblem(imgPath, problem.Problem)
	media, err := a.twitterApi.UploadImage(imgPath)
	if err == nil {
		buf, err := a.twitterApi.PostTweet("test", url.Values{"media_ids": []string{media.MediaIDString}})
		if err == nil {
			a.problemTweet = &buf
		} else {
			a.problemTweet = nil
		}
	}

	a.problem = app.NewProblemApp(*problem, a.Config, a.self)
	a.GameState.Interval = false
	a.problem.SyncAll()
	return nil
}

func (a *ArenaGameApp) OnFinishProblem(pointDiff map[model.UserID]int) {
	a.BaseGameApp.OnFinishProblem(pointDiff)

	if a.problemTweet != nil {
		a.twitterApi.PostTweet(
			"@"+a.problemTweet.User.ScreenName+"\nsolution \nOPT:"+strconv.Itoa(len(a.problem.GetProblem().Solution))+"moves",
			url.Values{
				"media_ids":             []string{a.solAnimMedia.MediaIDString},
				"in_reply_to_status_id": []string{a.problemTweet.IdStr},
			},
		)
	}
	if !a.self.isFinish() {
		//ここ他の処理と並行しちゃう可能性あるから直してくれ！！！！！！
		time.AfterFunc(10*time.Second, func() { a.self.StartProblem() })

		go a.addNextProblem()
	}
}

func (a *ArenaGameApp) addNextProblem() {
	problem, err := a.problemRepository.GetUnusedWithRange(a.Config.SolLenMin, a.Config.SolLenMax)
	if err != nil {
		problem, err = a.problemRepository.GetUnused()
		if err != nil {
			log.Fatal("there is no problem!!" + err.Error())
			return
		}
	}
	a.problemRepository.SetUsed(problem.ID)

	solAnimPath := "./solgif/" + strconv.Itoa(problem.ID) + ".gif"
	utils.DrawSolution(solAnimPath, problem.Problem, problem.Solution)
	a.solAnimMedia, _ = a.twitterApi.UploadGif(solAnimPath)
	a.nextProblem <- &problem
}
