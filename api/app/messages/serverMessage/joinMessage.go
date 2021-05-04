package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type JoinMessage struct {
	Type Type       `json:"type"`
	User model.User `json:"user"`
}

func NewJoinMessage(user model.User) JoinMessage {
	return JoinMessage{
		Type: Join,
		User: user,
	}
}
