package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type SetHintMessage struct {
	Type  Type        `json:"type"`
	Hands model.Hands `json:"hands"`
}

func NewSetHintMessage(hands model.Hands) SetHintMessage {
	return SetHintMessage{
		Type:  Hint,
		Hands: hands,
	}
}
