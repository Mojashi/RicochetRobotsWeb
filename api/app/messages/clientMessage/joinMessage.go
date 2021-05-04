package clientMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type JoinMessage struct {
	Type Type       `json:"type"`
	User model.User `json:"user"`
}

func (m JoinMessage) GetUser() model.User {
	return m.User
}
