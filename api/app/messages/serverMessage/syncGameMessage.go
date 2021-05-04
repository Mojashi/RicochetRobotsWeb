package serverMessage

import (
	"github.com/Mojashi/RicochetRobots/api/model"
)

type SyncGameMessage []ServerMessage

func NewSyncGameMessage(g *model.GameState) SyncGameMessage {
	msgs := SyncGameMessage{}

	msgs = append(msgs, NewStartGameMessage(g.ID))

	g.Participants.Range(func(userID, user interface{}) bool {
		msgs = append(msgs, NewJoinMessage(user.(model.User)))
		return true
	})

	g.Points.Range(func(userID, pt interface{}) bool {
		msgs = append(msgs, NewSetPointMessage(userID.(model.UserID), pt.(int)))
		return true
	})

	return msgs
}
