package handler

import (
	"net/http"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/labstack/echo/v4"
)

type RoomListHandler struct {
	roomManager app.IRoomManager
}

func NewRoomListHandler(manager app.IRoomManager) Handler {
	return &RoomListHandler{
		roomManager: manager,
	}
}
func (h *RoomListHandler) Handle(c echo.Context) error {
	list := h.roomManager.GetRoomList()
	return c.JSON(http.StatusOK, list)
}
