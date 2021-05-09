package serverMessage

import (
	"github.com/Mojashi/RicochetRobots/api/model"
)

type SyncRoomMessage []ServerMessage

func NewSyncRoomMessage(roomInfo model.RoomInfo, participants map[model.UserID]model.User /*userId user*/) SyncRoomMessage {
	msgs := SyncRoomMessage{}

	msgs = append(msgs, NewSetRoomInfoMessage(roomInfo))

	for _, user := range participants {
		msgs = append(msgs, NewJoinMessage(user))
	}

	return msgs
}
