package game

import (
	"encoding/json"
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/room"
)

type Rule string

const (
	WankoSoba  Rule = "wanko"
	DontBeLate Rule = "dblate"
)

type Game struct {
	ID          int          `json:"id"`
	Rule        Rule         `json:"rule"`
	Problem     Problem      `json:"problem"`
	Submissions []Submission `json:"subs"`
	StartDate   time.Time
	FinishDate  time.Time
	OnGame      bool

	onFinished  func()
	sMutex      sync.Mutex
	OnFinishing bool

	interval  int
	timelimit int
}

func MakeGame(rule Rule, onFinished func()) (*Game, error) {
	p, err := FetchUnusedProblem()
	if err != nil {
		return nil, err
	}

	return &Game{
		ID:          rand.Int(),
		Rule:        rule,
		Problem:     p,
		Submissions: []Submission{},
		OnGame:      false,
		OnFinishing: false,
		interval:    40,
		timelimit:   3,

		onFinished: onFinished,
		hub:        hub,
	}, nil
}

func (g *Game) readHandler(c *room.Client, msg []byte) error {
	if !g.OnGame {
		return nil
	}

	var event ClientEvent
	var user = c.User

	if err := json.Unmarshal(msg, &event); err != nil {
		return err
	}

	if event.Submit != nil && len(event.Submit.Hands) > 0 && c.User != nil {
		log.Println("event:submit")

		// user := site.User{Name: user.Name}
		hands := event.Submit.Hands
		date := time.Now()
		opt := len(hands) == len(g.Problem.OptHands)
		sub := Submission{Hands: hands, User: *user, Date: date, ID: rand.Int(), Optimal: opt}

		if len(hands) < 99 && CheckSolution(g.Problem.Board, event.Submit.Hands) {
			g.sMutex.Lock()
			if g.OnGame {
				g.Submissions = append(g.Submissions, sub)
				if !g.OnFinishing && opt {
					SendEvent(g.hub.Broadcast, ServerEvent{Submit: &SubmitSEvent{GameID: g.ID, Submission: sub}, TimeLimit: &TimeLimitSEvent{GameID: g.ID, RemTime: g.timelimit}})
					g.OnFinishing = true
					go func() {
						time.Sleep(time.Second * time.Duration(g.timelimit))
						g.finishGame(sub)
					}()
				} else {
					SendEvent(g.hub.Broadcast, ServerEvent{Submit: &SubmitSEvent{GameID: g.ID, Submission: sub}})
				}
			}
			g.sMutex.Unlock()
		} else {
			log.Println("invalid solution was sent to server")
		}
	}

	return nil
}

func (g *Game) finishGame(sub Submission) {
	log.Println("finished")
	g.FinishDate = time.Now()
	g.OnGame = false

	SendEvent(g.hub.Broadcast, ServerEvent{
		Finish: &FinishSEvent{
			GameID:   g.ID,
			Interval: &g.interval,
		},
		ShowSubmission: &ShowSubmissionSEvent{
			Submission: sub,
		},
	})
	if err := SetUsed(g.Problem.ID); err != nil {
		log.Fatal(err.Error())
	}
	g.onFinished()
}

func (g *Game) Run() error {
	g.OnGame = true
	g.StartDate = time.Now()
	g.hub.SetReadHandler(g.readHandler)

	if err := SendEvent(g.hub.Broadcast, ServerEvent{Start: &StartSEvent{
		Game:        *g,
		Submissions: g.Submissions[:minInt(len(g.Submissions), 5)],
	}}); err != nil {
		log.Print(err)
		return err
	}
	return nil
}
