package arena

import (
	"log"
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

var sMutex sync.RWMutex

var hub *room.Hub
var curGame *game.Game

const interval = 40

func minInt(x int, y int) int {
	if x > y {
		return y
	}
	return x
}

func joinHandler(c *room.Client) error {
	log.Println("joined")
	if err := game.SendEvent(hub.Broadcast, game.ServerEvent{Join: &game.JoinSEvent{User: site.User{Name: "test"}}}); err != nil {
		return err
	}

	sort.SliceStable(curGame.Submissions, func(i, j int) bool { return len(curGame.Submissions[i].Hands) < len(curGame.Submissions[j].Hands) })
	if err := game.SendEvent(c.Send, game.ServerEvent{Start: &game.StartSEvent{
		Game:        *curGame,
		Submissions: curGame.Submissions[:minInt(len(curGame.Submissions), 5)],
	}}); err != nil {
		log.Print(err)
		return err
	}
	log.Print("sent")
	return nil
}

func leaveHandler(c *room.Client) error {
	log.Println("left")
	game.SendEvent(hub.Broadcast, game.ServerEvent{Leave: &game.LeaveSEvent{site.User{Name: "test"}}})
	return nil
}

func handleFinish() {
	log.Print("game finished")
	go func() {
		var err error = nil
		curGame, err = game.MakeGame(game.DontBeLate, handleFinish, hub)
		if err != nil {
			log.Fatal(err)
		}
		time.Sleep(time.Second * 10)
		curGame.Run()
	}()
}

func Init(g *echo.Group, _db *sqlx.DB) {
	db = _db
	sMutex = sync.RWMutex{}

	hub = room.NewHub()
	var err error = nil
	curGame, err = game.MakeGame(game.DontBeLate, handleFinish, hub)
	if err != nil {
		log.Fatal("couldnt make new game : ", err)
	}
	g.GET("/ws", func(c echo.Context) error {
		return room.ServeWs(hub, c)
	})
	g.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	go hub.Run(joinHandler, leaveHandler)
	curGame.Run()
}
