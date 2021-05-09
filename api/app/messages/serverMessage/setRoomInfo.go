package serverMessage

import (
	"github.com/Mojashi/RicochetRobots/api/model"
)

type SetRoomInfoMessage struct {
	Type     Type           `json:"type"`
	RoomInfo model.RoomInfo `json:"roomInfo"`
}

func NewSetRoomInfoMessage(roomInfo model.RoomInfo) SetRoomInfoMessage {
	return SetRoomInfoMessage{
		Type:     SetRoomInfo,
		RoomInfo: roomInfo,
	}
}
