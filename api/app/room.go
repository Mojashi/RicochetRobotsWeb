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
	Auth(password string) bool

	Broadcast(msg serverMessage.ServerMessage)
	Send(userID model.UserID, msg serverMessage.ServerMessage) error

	Join(c Client) error
	Leave(c Client)
	SetGameConfig(conf model.GameConfig)
	StartGame(gameConfig model.GameConfig) error

	Reducer(c Client, msg clientMessage.ClientMessage) error

	Sync(dest model.UserID) error
	SyncAll() error
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

func (r *RoomApp) Auth(password string) bool {
	return !r.roomInfo.Private || r.roomInfo.Password == password
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
		return errors.New("the user doesnt participate in")
	}
	return c.(Client).Send(msg)
}

func (r *RoomApp) Join(c Client) error {
	c.Run(r)
	r.Participate(c, "")
	return nil
}
func (r *RoomApp) authorize(user model.User, password string) bool {
	return !r.roomInfo.Private || r.roomInfo.Password == password || r.IsRoomAdmin(user)
}
func (r *RoomApp) IsRoomAdmin(user model.User) bool {
	return r.roomInfo.Admin.ID == user.ID
}
func (r *RoomApp) isParticipant(user model.User) bool {
	_, parted := r.participants.Load(user.ID)
	return parted
}

func (r *RoomApp) Participate(c Client, password string) error {
	if !r.authorize(c.GetUser(), password) {
		c.Send(serverMessage.NewUnauthMessage())
		return errors.New("password is incorrect")
	}

	bc, loaded := r.participants.LoadAndDelete(c.GetUser().ID)
	if loaded {
		bc.(Client).Delete()
	} else {
		r.Broadcast(serverMessage.NewJoinMessage(c.GetUser()))
	}

	r.participants.Store(c.GetUser().ID, c)
	if r.roomInfo.OnGame {
		r.gameApp.Join(c.GetUser())
	}
	r.Sync(c.GetUser().ID)
	return nil
}
func (r *RoomApp) Leave(c Client) {
	r.participants.Delete(c.GetUser().ID)
	if r.roomInfo.Admin.ID == c.GetUser().ID {
		r.participants.Range(func(key, value interface{}) bool {
			r.roomInfo.Admin = value.(Client).GetUser()
			return false
		})
		if r.roomInfo.Admin.ID == c.GetUser().ID { //つまり、更新されなかった、誰もルームにいない
			r.Delete()
			return
		}
		r.Broadcast(serverMessage.NewSetRoomInfoMessage(r.roomInfo))
	}
	if r.roomInfo.OnGame {
		r.gameApp.Leave(c.GetUser())
	}
	r.Broadcast(serverMessage.NewLeaveMessage(c.GetUser()))
}
func (r *RoomApp) SetGameConfig(conf model.GameConfig) {
	r.roomInfo.GameConfig = conf
}
func (r *RoomApp) StartGame(gameConfig model.GameConfig) error {
	r.roomInfo.GameConfig = gameConfig
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
	joinM, ok := msg.(clientMessage.JoinMessage)
	if ok {
		r.Participate(c, joinM.GetPassword())
	}
	if !r.isParticipant(c.GetUser()) { //まだ認証突破してない
		return c.Send(serverMessage.NewUnauthMessage())
	}

	switch m := msg.(type) {
	case clientMessage.LeaveMessage:
		r.Leave(c)
	case clientMessage.StartGameRequestMessage:
		if r.IsRoomAdmin(c.GetUser()) {
			r.StartGame(m.GameConfig)
		}
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

func (r *RoomApp) SyncAll() error {
	r.Broadcast(serverMessage.NewSyncRoomMessage(r.roomInfo, r.getParticipantsMap()))
	if r.roomInfo.OnGame {
		r.gameApp.SyncAll()
	}
	return nil
}
func (r *RoomApp) Sync(dest model.UserID) error {
	r.Send(dest, serverMessage.NewSyncRoomMessage(r.roomInfo, r.getParticipantsMap()))
	if r.roomInfo.OnGame {
		return r.gameApp.Sync(dest)
	}
	return nil
}

func (r *RoomApp) getParticipantsMap() map[model.UserID]model.User {
	ret := map[model.UserID]model.User{}

	r.participants.Range(func(userID, c interface{}) bool {
		ret[userID.(model.UserID)] = c.(Client).GetUser()
		return true
	})
	return ret
}
