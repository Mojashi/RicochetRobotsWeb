package arena

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/game"
	"github.com/Mojashi/RicochetRobotsWeb/api/room"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var (
	upgrader = websocket.Upgrader{}
)

type ArenaGame struct {
	board      game.Board
	finishDate time.Time
}

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

func readHandler(c *room.Client, msg []byte) error {
	var event ClientEvent

	if err := json.Unmarshal(msg, &event); err != nil {
		return err
	}

	if event.Submit != nil && len(event.Submit.Hands) > 0 {
		log.Println("event:submit")
		log.Println(string(msg))
		sendEvent(hub.Broadcast, ServerEvent{Submit: &SubmitSEvent{Hands: event.Submit.Hands}})
	}

	return nil
}

func joinHandler(c *room.Client) error {
	log.Println("joined")
	if err := sendEvent(hub.Broadcast, ServerEvent{Join: &JoinSEvent{Name: "test"}}); err != nil {
		return err
	}

	if err := sendEvent(c.Send, ServerEvent{Start: &StartSEvent{Board: curGame.board, FinishDate: curGame.finishDate}}); err != nil {
		log.Print(err)
		return err
	}
	log.Print("sent")
	return nil
}

func leaveHandler(c *room.Client) error {
	log.Println("left")
	sendEvent(hub.Broadcast, ServerEvent{Leave: &LeaveSEvent{Name: "test"}})
	return nil
}

func Arena(g *echo.Group) {
	hub = room.NewHub()
	board := game.NewBoard(10, 10)
	board.Cells[2][2].Walls[3] = true
	ma := game.Red
	board.Cells[4][5].Mark = &ma
	mi := game.RMIRROR
	board.Cells[6][8].Mirror = &mi
	board.Cells[9][2].Goal = true
	curGame = ArenaGame{board: board, finishDate: time.Now().Add(10 * time.Minute)}

	g.GET("/ws", func(c echo.Context) error {
		return room.ServeWs(hub, c, readHandler)
	})
	g.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	go hub.Run(joinHandler, leaveHandler)
}
