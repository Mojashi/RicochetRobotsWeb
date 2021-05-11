package handler

import (
	"encoding/json"
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

	settings := model.RoomSettings{}
	if err := c.Bind(&settings); err != nil {
		return err
	}
	if settings.Name == "" {
		return echo.NewHTTPError(403, "たくの名前を入力してください")
	}
	if settings.Private && settings.Password == "" {
		return echo.NewHTTPError(403, "パスワードが必要です")
	}

	roomID, err := h.roomManager.NewRoom(user, settings)
	if err != nil {
		return err
	}
	type Ret = struct {
		RoomID int `json:"roomID"`
	}
	str, _ := json.Marshal(Ret{
		RoomID: roomID,
	})
	return c.String(http.StatusOK, string(str))
}
