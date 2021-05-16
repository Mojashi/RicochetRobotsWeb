package app

import (
	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
)

type IRoomApp interface {
	SendMessage(c Client, msg clientMessage.ClientMessage)
	Run() error
}

type IRoomObserver interface {
	ChangeRoomInfo(roomInfo model.RoomInfo)
	AddParticipant(id int, user model.User)
	RemoveParticipant(id int, user model.User)
	Delete(id int)
}

func SendStartRequest(r IRoomApp, conf model.GameConfig) {
	r.SendMessage(DummyClient{User: model.SuperUser}, clientMessage.NewStartGameRequestMessage(conf))
}
func SendDelete(r IRoomApp) {
	r.SendMessage(DummyClient{User: model.SuperUser}, clientMessage.NewDelteRoomMessage())
}
func SendJoin(r IRoomApp, c Client) {
	r.SendMessage(c, clientMessage.NewClientJoinMessage(""))
}
func SendLeave(r IRoomApp, c Client) {
	r.SendMessage(c, clientMessage.NewClientLeaveMessage())
}
