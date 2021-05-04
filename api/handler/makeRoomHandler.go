package handler

import (
	"net/http"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/labstack/echo/v4"
)

type MakeRoomHandler struct {
	roomManager app.IRoomManager
}

func NewMakeRoomHandler(roomManager app.IRoomManager) Handler {
	return &MakeRoomHandler{roomManager: roomManager}
}

func (h MakeRoomHandler) Handle(c echo.Context) error {
	room := h.roomManager.NewRoom()

	return c.JSON(http.StatusOK, room)
}
