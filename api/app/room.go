package app

import (
	"errors"

	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
)

type IRoomApp interface {
	SendLeave(c Client)
	SendJoin(c Client)
	SendDelete()
	SendMessage(c Client, msg clientMessage.ClientMessage)
}

type IRoomObserver interface {
	ChangeRoomInfo(roomInfo model.RoomInfo)
	AddParticipant(id int, user model.User)
	RemoveParticipant(id int, user model.User)
	Delete(id int)
}

type MsgWithSender struct {
	sender     Client
	msg        clientMessage.ClientMessage
	systemMade bool
}

//implements GameOutput
type RoomApp struct {
	active  bool
	msgChan chan MsgWithSender

	participants      map[model.UserID]Client
	gameApp           IGameApp
	roomInfo          model.RoomInfo
	problemRepository repository.IProblemWithSolutionRepository

	roomManager IRoomObserver
}

func NewRoomApp(
	room model.RoomInfo,
	roomManager IRoomObserver,
	problemRepository repository.IProblemWithSolutionRepository,
) IRoomApp {
	roomApp := &RoomApp{participants: map[model.UserID]Client{}, msgChan: make(chan MsgWithSender, 100), roomInfo: room, problemRepository: problemRepository, roomManager: roomManager}
	roomApp.Run()
	return roomApp
}

func (r *RoomApp) SendDelete() {
	r.SendMessage(DummyClient{user: model.SuperUser}, clientMessage.NewDelteRoomMessage())
}
func (r *RoomApp) SendJoin(c Client) {
	r.SendMessage(c, clientMessage.NewClientJoinMessage(""))
}
func (r *RoomApp) SendLeave(c Client) {
	r.SendMessage(c, clientMessage.NewClientLeaveMessage())
}

func (r *RoomApp) SendMessage(c Client, msg clientMessage.ClientMessage) {
	if !r.active {
		return
	}
	r.msgChan <- MsgWithSender{
		sender: c,
		msg:    msg,
	}
}

func (r *RoomApp) Run() error {
	r.active = true
	go r.Reducer()
	return nil
}

func (r *RoomApp) Reducer() error {
	for msgWithSender := range r.msgChan {
		msg := msgWithSender.msg
		c := msgWithSender.sender

		if joinM, ok := msg.(clientMessage.JoinMessage); ok {
			r.Participate(c, joinM.GetPassword())
			continue
		}
		if !r.IsRoomAdmin(c.GetUser()) && !r.isParticipant(c.GetUser()) { //まだ認証突破してない
			c.Send(serverMessage.NewUnauthMessage())
			continue
		}

		switch m := msg.(type) {
		case clientMessage.LeaveMessage:
			r.Leave(c)
		case clientMessage.StartGameRequestMessage:
			if r.IsRoomAdmin(c.GetUser()) {
				r.SetGameConfig(m.GameConfig)
				r.StartGame()
			}
		case clientMessage.SetGameSettingsMessage:
			if r.IsRoomAdmin(c.GetUser()) {
				r.SetGameConfig(m.GameConfig)
			}
		case clientMessage.DeleteRoomMessage:
			if r.IsRoomAdmin(c.GetUser()) {
				r.Delete()
			}
		default:
			if r.roomInfo.OnGame {
				r.gameApp.Reducer(c.GetUser(), msg)
			}
		}
	}
	return nil
}

func (r *RoomApp) Delete() {
	if !r.active {
		return
	}
	r.active = false

	for _, c := range r.participants {
		c.Delete()
	}
	close(r.msgChan)
	r.roomManager.Delete(r.roomInfo.ID)
}

func (r *RoomApp) Auth(password string) bool {
	return !r.roomInfo.Private || r.roomInfo.Password == password
}

func (r *RoomApp) Broadcast(msg serverMessage.ServerMessage) {
	for _, c := range r.participants {
		c.Send(msg)
	}
}
func (r *RoomApp) Send(userID model.UserID, msg serverMessage.ServerMessage) error {
	c, ok := r.participants[userID]
	if !ok {
		return errors.New("the user doesnt participate in")
	}
	return c.Send(msg)
}

func (r *RoomApp) authorize(user model.User, password string) bool {
	return !r.roomInfo.Private || r.roomInfo.Password == password || r.IsRoomAdmin(user)
}
func (r *RoomApp) IsRoomAdmin(user model.User) bool {
	return r.roomInfo.Admin.ID == user.ID || user.ID == model.SuperUser.ID
}
func (r *RoomApp) isParticipant(user model.User) bool {
	_, parted := r.participants[user.ID]
	return parted
}

func (r *RoomApp) Participate(c Client, password string) error {
	user := c.GetUser()
	if !r.authorize(user, password) {
		c.Send(serverMessage.NewUnauthMessage())
		return errors.New("password is incorrect")
	}

	bc, ok := r.participants[user.ID]
	if ok {
		bc.(Client).Delete()
	} else {
		r.Broadcast(serverMessage.NewJoinMessage(user))
		r.roomManager.AddParticipant(r.roomInfo.ID, user)
	}

	r.participants[user.ID] = c
	if r.roomInfo.OnGame {
		r.gameApp.Join(user)
	}
	r.Sync(user.ID)
	return nil
}
func (r *RoomApp) Leave(c Client) {
	user := c.GetUser()
	if !r.isParticipant(user) {
		return
	}

	delete(r.participants, user.ID)
	if r.roomInfo.Admin.ID == user.ID {
		if len(r.participants) == 0 {
			r.Delete()
			return
		}

		for _, nextAdmin := range r.participants {
			r.SetAdmin(nextAdmin.GetUser())
		}
		r.Broadcast(serverMessage.NewSetRoomInfoMessage(r.roomInfo))
	}
	if r.roomInfo.OnGame {
		r.gameApp.Leave(user)
	}
	c.Delete()
	r.roomManager.RemoveParticipant(r.roomInfo.ID, user)
	r.Broadcast(serverMessage.NewLeaveMessage(user))
}

func (r *RoomApp) StartGame() error {
	r.SetOnGame(true)

	var err error
	r.gameApp, err = NewGameApp(
		r.getParticipantsMap(),
		r.roomInfo.GameConfig,
		r,
		r.problemRepository,
	)
	return err
}

func (r *RoomApp) OnFinishGame() {
	r.SetOnGame(false)
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
	for userID, c := range r.participants {
		ret[userID] = c.GetUser()
	}
	return ret
}

func (r *RoomApp) SetGameConfig(conf model.GameConfig) {
	r.roomInfo.GameConfig = conf
	r.roomManager.ChangeRoomInfo(r.roomInfo)
}
func (r *RoomApp) SetOnGame(onGame bool) {
	r.roomInfo.OnGame = onGame
	r.roomManager.ChangeRoomInfo(r.roomInfo)
}
func (r *RoomApp) SetAdmin(admin model.User) {
	r.roomInfo.Admin = admin
	r.roomManager.ChangeRoomInfo(r.roomInfo)
}
