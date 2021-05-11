package serverMessage

import (
	"github.com/Mojashi/RicochetRobots/api/model"
)

type SyncGameMessage []ServerMessage

func NewSyncGameMessage(g *model.GameState, leftParts map[model.UserID]model.User) SyncGameMessage {
	msgs := SyncGameMessage{}

	msgs = append(msgs, NewStartGameMessage(g.ID))

	for _, user := range leftParts {
		msgs = append(msgs, NewTellUserMessage(user))
	}

	for userID, point := range g.Points {
		msgs = append(msgs, NewSetPointMessage(userID, point))
	}

	return msgs
}
