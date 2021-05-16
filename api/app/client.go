package app

import (
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
)

//送信順に受信されるすることを保証
type Client interface {
	GetUser() model.User
	Send(msg serverMessage.ServerMessage) error
	Delete() error
}

type DummyClient struct {
	User model.User
}

func (c DummyClient) GetUser() model.User {
	return c.User
}
func (c DummyClient) Send(msg serverMessage.ServerMessage) error {
	return nil
}
func (c DummyClient) Delete() error {
	return nil
}
