package handler

import (
	"math/rand"
	"net/http"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/labstack/echo/v4"
)

type MakeRoomHandler struct {
	roomManager app.IRoomManager
}

func NewMakeRoomHandler(roomManager app.IRoomManager) Handler {
	return &MakeRoomHandler{roomManager: roomManager}
}

func (h MakeRoomHandler) Handle(c echo.Context) error {
	var user model.User
	if c.Get("authorized").(bool) {
		user = c.Get("user").(model.User)
	} else {
		user = model.User{ID: model.UserID(rand.Intn(1000000)), Name: "guest", TwitterID: ""}
	}
	room := h.roomManager.NewRoom(user)

	return c.JSON(http.StatusOK, room)
}
