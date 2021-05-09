package serverMessage

import (
	"sync"

	"github.com/Mojashi/RicochetRobots/api/model"
)

type SyncGameMessage []ServerMessage

func NewSyncGameMessage(g *model.GameState, leftParts *sync.Map) SyncGameMessage {
	msgs := SyncGameMessage{}

	msgs = append(msgs, NewStartGameMessage(g.ID))

	leftParts.Range(func(_, user interface{}) bool {
		msgs = append(msgs, NewTellUserMessage(user.(model.User)))
		return true
	})

	g.Points.Range(func(userID, pt interface{}) bool {
		msgs = append(msgs, NewSetPointMessage(userID.(model.UserID), pt.(int)))
		return true
	})

	return msgs
}
