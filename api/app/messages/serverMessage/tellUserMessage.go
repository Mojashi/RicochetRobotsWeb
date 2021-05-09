package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type TellUserMessage struct {
	Type Type       `json:"type"`
	User model.User `json:"user"`
}

func NewTellUserMessage(user model.User) TellUserMessage {
	return TellUserMessage{
		Type: TellUser,
		User: user,
	}
}
