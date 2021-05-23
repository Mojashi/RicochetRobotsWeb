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

	arenaLogRepository repository.IArenaLogRepository
	userRepository     repository.IUserRepository
	twitterApi         twitter.TwitterAPI
	problemTweet       *anaconda.Tweet
	solAnimMedia       *anaconda.VideoMedia
	nextProblem        chan *model.ProblemWithSolution
	currentRound       int
}

func NewArenaGameApp(
	twApi twitter.TwitterAPI,
	userRepository repository.IUserRepository,
	arenaLogRepository repository.IArenaLogRepository,
	users map[model.UserID]model.User,
	conf model.GameConfig,
	output app.IGameOutput,
	problemRepository repository.IProblemWithSolutionRepository,
	self IArenaGameApp,
) *ArenaGameApp {
	g := &ArenaGameApp{
		twitterApi:         twApi,
		self:               self,
		userRepository:     userRepository,
		nextProblem:        make(chan *model.ProblemWithSolution, 10),
		arenaLogRepository: arenaLogRepository,
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
	a.currentRound = a.arenaLogRepository.GetLatestGameID() + 1

	problem := <-a.nextProblem
	imgPath := "./boardImg.png"
	utils.DrawProblem(imgPath, problem.Problem)
	media, err := a.twitterApi.UploadImage(imgPath)
	if err == nil {
		buf, err := a.twitterApi.PostTweet(
			"ラウンド "+strconv.Itoa(a.currentRound)+"\n"+"https://ricochetrobots.mojashidev.xyz/room/0",
			url.Values{"media_ids": []string{media.MediaIDString}},
		)
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

//ポイントの情報からWinnerを推察してるんだけど、あんまよくないね
func getWinner(pointDiff map[model.UserID]int) model.UserID {
	maxPt := -1
	var ret model.UserID
	for userID, pt := range pointDiff {
		if maxPt < pt {
			maxPt = pt
			ret = userID
		}
	}
	return ret
}

func (a *ArenaGameApp) OnFinishProblem(pointDiff map[model.UserID]int) {
	a.BaseGameApp.OnFinishProblem(pointDiff)
	var winner model.User
	winner, ok := a.Participants[getWinner(pointDiff)]
	if ok {
		a.arenaLogRepository.Create(a.currentRound, winner.ID)
	}

	if a.problemTweet != nil {
		a.twitterApi.PostTweet(
			"@"+a.problemTweet.User.ScreenName+"\n"+
				"winner @."+winner.Name+"\n"+
				"OPT:"+strconv.Itoa(len(a.problem.GetProblem().Solution))+"moves",
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
	problem, err := a.problemRepository.GetUnusedWithConfig(a.Config.ProblemConfig, false)
	if err != nil {
		problem, err = a.problemRepository.GetUnusedWithConfig(a.Config.ProblemConfig, true)
		if err != nil {
			problem, err = a.problemRepository.GetUnused()
			if err != nil {
				log.Fatal("there is no problem!!" + err.Error())
			}
		}
	}
	a.problemRepository.SetUsed(problem.ID)

	solAnimPath := "./solution.gif"
	utils.DrawSolution(solAnimPath, problem.Problem, problem.Solution)
	a.solAnimMedia, _ = a.twitterApi.UploadGif(solAnimPath)
	a.nextProblem <- &problem
}
