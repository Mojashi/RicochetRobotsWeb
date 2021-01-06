package arena

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"sort"
	"sync"
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/game"
	"github.com/Mojashi/RicochetRobotsWeb/api/room"
	"github.com/Mojashi/RicochetRobotsWeb/api/site"
	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

var (
	upgrader = websocket.Upgrader{}
	db       *sqlx.DB
)

type Submission struct {
	ID      int         `json:"id"`
	User    site.User   `json:"user"`
	Hands   []game.Hand `json:"hands"`
	Date    time.Time   `json:"date"`
	Optimal bool        `json:"opt"`
}

type ArenaGame struct {
	gameID      int
	problemID   int
	problem     game.Problem
	submissions []Submission
	finishDate  time.Time
	onGame      bool
}

var sMutex sync.RWMutex

var hub *room.Hub
var curGame ArenaGame

func sendEvent(c chan<- []byte, event ServerEvent) error {
	var msg []byte
	var err error
	msg, err = json.Marshal(event)

	if msg, err = json.Marshal(event); err != nil {
		log.Print(err)
		return err
	}
	c <- msg
	return nil
}

func startGame() error {
	problemID, problem, err := game.FetchUnusedProblem(db)
	if err != nil {
		log.Fatal(err.Error())
	}
	curGame = ArenaGame{gameID: curGame.gameID + 1, problemID: problemID, problem: problem, submissions: []Submission{}, finishDate: time.Now().Add(10 * time.Minute), onGame: true}

	if err := sendEvent(hub.Broadcast, ServerEvent{Start: &StartSEvent{
		GameID:      curGame.gameID,
		Game:        curGame.problem.Game,
		Submissions: curGame.submissions[:minInt(len(curGame.submissions), 5)],
		FinishDate:  curGame.finishDate,
	}}); err != nil {
		log.Print(err)
		return err
	}
	return nil
}

func finishGame(sub Submission) {
	log.Println("finished")
	sendEvent(hub.Broadcast, ServerEvent{Finish: &FinishSEvent{
		GameID:     curGame.gameID,
		Submission: sub,
	}})
	if err := game.SetUsed(db, curGame.problemID); err != nil {
		log.Fatal(err.Error())
	}
	curGame.onGame = false

	go func() {
		time.Sleep(time.Second * 10)
		startGame()
	}()
}

type eventMsg struct {
	c *room.Client
	e ClientEvent
}

// func eventHandler(ch chan eventMsg) error {
// 	for em := range ch {
// 		c := em.c
// 		e :
// 	}
// }

func readHandler(c *room.Client, msg []byte) error {
	if !curGame.onGame {
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
		opt := len(hands) == len(curGame.problem.OptHands)
		sub := Submission{Hands: hands, User: *user, Date: date, ID: rand.Int(), Optimal: opt}

		if len(hands) < 99 && game.CheckSolution(curGame.problem.Game, event.Submit.Hands) {
			sMutex.Lock()
			if curGame.onGame {
				curGame.submissions = append(curGame.submissions, sub)
				sendEvent(hub.Broadcast, ServerEvent{Submit: &SubmitSEvent{GameID: curGame.gameID, Submission: sub}})
				if opt {
					finishGame(sub)
				}
			}
			sMutex.Unlock()
		} else {
			log.Println("invalid solution was sent to server")
		}
	}

	return nil
}

func minInt(x int, y int) int {
	if x > y {
		return y
	}
	return x
}

func joinHandler(c *room.Client) error {
	log.Println("joined")
	if err := sendEvent(hub.Broadcast, ServerEvent{Join: &JoinSEvent{User: site.User{Name: "test"}}}); err != nil {
		return err
	}

	sort.SliceStable(curGame.submissions, func(i, j int) bool { return len(curGame.submissions[i].Hands) < len(curGame.submissions[j].Hands) })
	if err := sendEvent(c.Send, ServerEvent{Start: &StartSEvent{
		GameID:      curGame.gameID,
		Game:        curGame.problem.Game,
		Submissions: curGame.submissions[:minInt(len(curGame.submissions), 5)],
		FinishDate:  curGame.finishDate,
	}}); err != nil {
		log.Print(err)
		return err
	}
	log.Print("sent")
	return nil
}

func leaveHandler(c *room.Client) error {
	log.Println("left")
	sendEvent(hub.Broadcast, ServerEvent{Leave: &LeaveSEvent{site.User{Name: "test"}}})
	return nil
}

func Init(g *echo.Group, _db *sqlx.DB) {
	db = _db
	sMutex = sync.RWMutex{}

	hub = room.NewHub()
	startGame()

	g.GET("/ws", func(c echo.Context) error {
		return room.ServeWs(hub, c, readHandler)
	})
	g.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	go hub.Run(joinHandler, leaveHandler)
}
