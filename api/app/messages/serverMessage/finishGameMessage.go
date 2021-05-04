package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type FinishGameMessage struct {
	Type Type `json:"type"`
}

func NewFinishGameMessage(g *model.GameState) FinishGameMessage {
	return FinishGameMessage{
		Type: FinishGame,
	}
}
