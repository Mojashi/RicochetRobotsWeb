package app

import (
	"errors"
	"sync"

	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
)

type Client interface {
	GetUser() model.User
	Send(msg serverMessage.ServerMessage) error
	Run(r IRoomApp) error
	Delete() error
}

type IRoomApp interface {
	Delete()

	Broadcast(msg serverMessage.ServerMessage)
	Send(userID model.UserID, msg serverMessage.ServerMessage) error

	Join(c Client) error
	Leave(c Client)
	SetGameConfig(conf model.GameConfig)
	StartGame() error

	Reducer(c Client, msg clientMessage.ClientMessage) error
}

//implements GameOutput
type RoomApp struct {
	participants      sync.Map //map[model.UserID]Dest
	gameApp           IGameApp
	roomInfo          model.RoomInfo
	problemRepository repository.IProblemWithSolutionRepository
}

func NewRoomApp(
	room model.RoomInfo,
	problemRepository repository.IProblemWithSolutionRepository,
) *RoomApp {
	return &RoomApp{participants: sync.Map{}, roomInfo: room, problemRepository: problemRepository}
}

func (r *RoomApp) Delete() {
	r.participants.Range(func(key, value interface{}) bool {
		value.(Client).Delete()
		return true
	})
}

func (r *RoomApp) Broadcast(msg serverMessage.ServerMessage) {
	r.participants.Range(func(key, value interface{}) bool {
		value.(Client).Send(msg)
		return true
	})
}
func (r *RoomApp) Send(userID model.UserID, msg serverMessage.ServerMessage) error {
	c, ok := r.participants.Load(userID)
	if !ok {
		return errors.New("the user doesnt participate")
	}
	return c.(Client).Send(msg)
}

func (r *RoomApp) Join(c Client) error {
	c.Run(r)
	r.participants.Store(c.GetUser().ID, c)
	if r.roomInfo.OnGame {
		r.gameApp.Join(c.GetUser())
	}
	return nil
}
func (r *RoomApp) Leave(c Client) {
	r.participants.Delete(c.GetUser().ID)
	if r.roomInfo.OnGame {
		r.gameApp.Leave(c.GetUser())
	}
}
func (r *RoomApp) SetGameConfig(conf model.GameConfig) {
	r.roomInfo.GameConfig = conf
}
func (r *RoomApp) StartGame() error {
	r.roomInfo.OnGame = true

	parts := &sync.Map{}
	r.participants.Range(func(key, value interface{}) bool {
		parts.Store(key, value.(Client).GetUser())
		return true
	})
	var err error
	r.gameApp, err = NewGameApp(
		parts,
		r.roomInfo.GameConfig,
		r,
		r.problemRepository,
	)
	return err
}

func (r *RoomApp) Reducer(c Client, msg clientMessage.ClientMessage) error {
	switch msg.(type) {
	case clientMessage.JoinMessage:
		return r.Join(c)
	case clientMessage.LeaveMessage:
		r.Leave(c)
	case clientMessage.StartGameRequestMessage:
		r.StartGame()
	default:
		if r.roomInfo.OnGame {
			return r.gameApp.Reducer(c.GetUser(), msg)
		}
	}
	return nil
}

func (r *RoomApp) OnFinishGame() {
	r.roomInfo.OnGame = false
}
