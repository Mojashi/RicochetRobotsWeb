package app

import (
	"github.com/Mojashi/RicochetRobots/api/model"
)

type IRoomManager interface {
	NewRoom(user model.User, settings model.RoomSettings) (int, error)
	NewArena() (int, error)
	Get(id int) (IRoomApp, error)
	Delete(id int)
	GetRoomList() []model.RoomAbstract
}
