package handler

import (
	"math/rand"
	"strconv"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type JoinHandler struct {
	roomManager app.IRoomManager
}

func NewJoinHandler(roomManager app.IRoomManager) Handler {
	return &JoinHandler{roomManager: roomManager}
}

func (h JoinHandler) Handle(c echo.Context) error {
	var user model.User
	if c.Get("authorized").(bool) {
		user = c.Get("user").(model.User)
	} else {
		user = model.User{ID: model.UserID(rand.Intn(1000000)), Name: "guest", TwitterID: ""}
	}

	roomID, err := strconv.Atoi(c.Param("roomID"))
	if err != nil {
		return err
	}

	roomApp, err := h.roomManager.Get(roomID)
	if err != nil {
		return c.String(404, err.Error())
	}
	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	client, _ := NewClient(conn, user)
	if err := roomApp.Join(client); err != nil {
		return err
	}

	return c.NoContent(200)
}
