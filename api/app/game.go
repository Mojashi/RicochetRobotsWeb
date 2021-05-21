package app

import (
	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
)

type IGameApp interface { //かならず１スレッドからしか触られない前提(Roomが１個ずつしか通さないので)
	Reducer(user model.User, msg clientMessage.ClientMessage) error
	Sync(dest model.UserID) error
	SyncAll() error
	Run() error
	Join(user model.User)
	Leave(user model.User)
}

type IGameOutput interface {
	Broadcast(msg serverMessage.ServerMessage)
	Send(dest model.UserID, msg serverMessage.ServerMessage) error
	OnFinishGame(winner model.User)
	IsRoomAdmin(user model.User) bool
}
