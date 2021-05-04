package clientMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type LeaveMessage struct {
	Type Type       `json:"type"`
	User model.User `json:"user"`
}

func (m LeaveMessage) GetUser() model.User {
	return m.User
}
