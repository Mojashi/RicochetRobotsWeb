package clientMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type SetGameSettingsMessage struct {
	Type       Type             `json:"type"`
	GameConfig model.GameConfig `json:"gameConfig"`
}
