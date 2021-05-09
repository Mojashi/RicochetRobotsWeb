package clientMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type StartGameRequestMessage struct {
	Type       Type             `json:"type"`
	GameConfig model.GameConfig `json:"gameConfig"`
}
