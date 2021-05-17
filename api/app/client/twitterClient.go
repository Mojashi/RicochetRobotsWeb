package client

import (
	"errors"
	"time"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/twitter"
)

type TwitterClient struct {
	user        model.User
	createdTime time.Time

	twApi twitter.TwitterAPI
	room  app.IRoomApp

	alive bool
}

func NewTwitterClient(u model.User, twApi twitter.TwitterAPI, room app.IRoomApp) *TwitterClient {
	c := &TwitterClient{
		user:        u,
		createdTime: time.Now(),
		twApi:       twApi,
		room:        room,
		alive:       true,
	}
	c.room.SendMessage(c, clientMessage.NewClientJoinMessage(""))
	return c
}

func (c *TwitterClient) Submit(tweet twitter.TweetCreateEvent) error {
	if !c.alive {
		return errors.New("not alive")
	}
	hands, err := model.StrToHands(tweet.Text)
	if err != nil {
		return err
	}
	c.room.SendMessage(c, clientMessage.NewSubmitMessage(hands))
	return nil
}

func (c *TwitterClient) GetUser() model.User {
	return c.user
}

func (c *TwitterClient) Send(msg serverMessage.ServerMessage) error {
	if !c.alive {
		return errors.New("not alive")
	}
	if _, ok := msg.(serverMessage.FinishGameMessage); ok {
		c.room.SendMessage(c, clientMessage.NewClientLeaveMessage())
		c.Delete()
	}
	return nil
}

func (c *TwitterClient) Delete() error {
	c.alive = false
	return nil
}
