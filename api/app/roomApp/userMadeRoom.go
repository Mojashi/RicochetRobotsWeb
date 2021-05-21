package roomApp

import (
	"errors"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/app/gameApp"
	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
)

type IUserMadeRoomApp interface {
	app.IRoomApp
	Reducer() error
	Delete()
	Auth(password string) bool
	Broadcast(msg serverMessage.ServerMessage)
	Send(userID model.UserID, msg serverMessage.ServerMessage) error
	authorize(user model.User, password string) bool
	IsRoomAdmin(user model.User) bool
	isParticipant(user model.User) bool
	Participate(c app.Client, password string) error
	Leave(c app.Client)
	StartGame() error
	OnFinishGame(user model.User)
	SyncAll()
	Sync(dest model.UserID) error
	GetSyncRoomMessage() serverMessage.ServerMessage
	getParticipantsMap() map[model.UserID]model.User
	SetGameConfig(conf model.GameConfig)
	SetOnGame(onGame bool)
	SetAdmin(admin model.User)
}

//implements GameOutput
type UserMadeRoomApp struct {
	active  bool
	msgChan chan MsgWithSender

	participants      map[model.UserID]app.Client
	gameApp           app.IGameApp
	roomInfo          model.RoomInfo
	problemRepository repository.IProblemWithSolutionRepository

	roomManager app.IRoomObserver

	self IUserMadeRoomApp //delegationのための
}

func NewUserMadeRoomApp(
	room model.RoomInfo,
	roomManager app.IRoomObserver,
	problemRepository repository.IProblemWithSolutionRepository,
	self IUserMadeRoomApp,
) *UserMadeRoomApp {
	roomApp := &UserMadeRoomApp{
		participants:      map[model.UserID]app.Client{},
		msgChan:           make(chan MsgWithSender, 100),
		roomInfo:          room,
		problemRepository: problemRepository,
		roomManager:       roomManager,
		self:              self,
	}
	if self == nil {
		roomApp.self = roomApp
	}
	return roomApp
}

func (r *UserMadeRoomApp) SendMessage(c app.Client, msg clientMessage.ClientMessage) {
	if !r.active {
		return
	}
	r.msgChan <- MsgWithSender{
		Sender: c,
		Msg:    msg,
	}
}

func (r *UserMadeRoomApp) Run() error {
	r.active = true
	go r.self.Reducer()
	return nil
}

func (r *UserMadeRoomApp) Reducer() error {
	for msgWithSender := range r.msgChan {
		msg := msgWithSender.Msg
		c := msgWithSender.Sender

		if joinM, ok := msg.(clientMessage.JoinMessage); ok {
			r.self.Participate(c, joinM.GetPassword())
			continue
		}
		if !r.self.IsRoomAdmin(c.GetUser()) && !r.self.isParticipant(c.GetUser()) { //まだ認証突破してない
			c.Send(serverMessage.NewUnauthMessage())
			continue
		}

		switch m := msg.(type) {
		case clientMessage.LeaveMessage:
			r.self.Leave(c)
		case clientMessage.StartGameRequestMessage:
			if r.self.IsRoomAdmin(c.GetUser()) {
				r.self.SetGameConfig(m.GameConfig)
				r.self.StartGame()
			}
		case clientMessage.SetGameSettingsMessage:
			if r.self.IsRoomAdmin(c.GetUser()) {
				r.self.SetGameConfig(m.GameConfig)
			}
		case clientMessage.DeleteRoomMessage:
			if r.self.IsRoomAdmin(c.GetUser()) {
				r.self.Delete()
			}
		default:
			if r.roomInfo.OnGame {
				r.gameApp.Reducer(c.GetUser(), msg)
			}
		}
	}
	return nil
}

func (r *UserMadeRoomApp) Delete() {
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

func (r *UserMadeRoomApp) Auth(password string) bool {
	return !r.roomInfo.Private || r.roomInfo.Password == password
}

func (r *UserMadeRoomApp) Broadcast(msg serverMessage.ServerMessage) {
	for _, c := range r.participants {
		c.Send(msg)
	}
}
func (r *UserMadeRoomApp) Send(userID model.UserID, msg serverMessage.ServerMessage) error {
	c, ok := r.participants[userID]
	if !ok {
		return errors.New("the user doesnt participate in")
	}
	return c.Send(msg)
}

func (r *UserMadeRoomApp) authorize(user model.User, password string) bool {
	return !r.roomInfo.Private || r.roomInfo.Password == password || r.IsRoomAdmin(user)
}
func (r *UserMadeRoomApp) IsRoomAdmin(user model.User) bool {
	return r.roomInfo.Admin.ID == user.ID || user.ID == model.SuperUser.ID
}
func (r *UserMadeRoomApp) isParticipant(user model.User) bool {
	_, parted := r.participants[user.ID]
	return parted
}

func (r *UserMadeRoomApp) Participate(c app.Client, password string) error {
	user := c.GetUser()
	if !r.self.authorize(user, password) {
		c.Send(serverMessage.NewUnauthMessage())
		return errors.New("password is incorrect")
	}

	bc, ok := r.participants[user.ID]
	if ok {
		bc.(app.Client).Delete()
	} else {
		r.self.Broadcast(serverMessage.NewJoinMessage(user))
		r.roomManager.AddParticipant(r.roomInfo.ID, user)
	}

	r.participants[user.ID] = c
	if r.roomInfo.OnGame {
		r.gameApp.Join(user)
	}
	r.self.Sync(user.ID)
	return nil
}
func (r *UserMadeRoomApp) Leave(c app.Client) {
	user := c.GetUser()
	if !r.self.isParticipant(user) {
		return
	}

	delete(r.participants, user.ID)
	if r.roomInfo.Admin.ID == user.ID {
		setted := false
		for _, nextAdmin := range r.participants {
			if !model.IsGuestUser(nextAdmin.GetUser()) {
				r.self.SetAdmin(nextAdmin.GetUser())
				setted = true
				break
			}
		}
		if !setted {
			if len(r.participants) > 0 {
				r.self.Broadcast(serverMessage.NewNotifyMessage("ゲストのみになったため解散しました", 30))
			}
			r.self.Delete()
			return
		}
	}
	if r.roomInfo.OnGame {
		r.gameApp.Leave(user)
	}
	c.Delete()
	r.roomManager.RemoveParticipant(r.roomInfo.ID, user)
	r.self.Broadcast(serverMessage.NewLeaveMessage(user))
}

func (r *UserMadeRoomApp) StartGame() error {
	r.self.SetOnGame(true)

	var err error
	r.gameApp = gameApp.NewBaseGameApp(
		r.self.getParticipantsMap(),
		r.roomInfo.GameConfig,
		r.self,
		r.problemRepository,
		nil,
	)
	r.gameApp.Run()
	return err
}

func (r *UserMadeRoomApp) OnFinishGame(user model.User) {
	r.self.SetOnGame(false)
}

func (r *UserMadeRoomApp) SyncAll() {
	r.self.Broadcast(r.self.GetSyncRoomMessage())
	if r.roomInfo.OnGame && r.gameApp != nil {
		r.gameApp.SyncAll()
	}
}
func (r *UserMadeRoomApp) Sync(dest model.UserID) error {
	r.self.Send(dest, r.self.GetSyncRoomMessage())
	if r.roomInfo.OnGame && r.gameApp != nil {
		return r.gameApp.Sync(dest)
	}
	return nil
}

func (r *UserMadeRoomApp) GetSyncRoomMessage() serverMessage.ServerMessage {
	return serverMessage.NewSyncRoomMessage(r.roomInfo, r.self.getParticipantsMap())
}

func (r *UserMadeRoomApp) getParticipantsMap() map[model.UserID]model.User {
	ret := map[model.UserID]model.User{}
	for userID, c := range r.participants {
		ret[userID] = c.GetUser()
	}
	return ret
}

func (r *UserMadeRoomApp) SetGameConfig(conf model.GameConfig) {
	r.roomInfo.GameConfig = conf
	r.self.Broadcast(serverMessage.NewSetRoomInfoMessage(r.roomInfo))
	r.roomManager.ChangeRoomInfo(r.roomInfo)
}
func (r *UserMadeRoomApp) SetOnGame(onGame bool) {
	r.roomInfo.OnGame = onGame
	r.roomManager.ChangeRoomInfo(r.roomInfo)
}
func (r *UserMadeRoomApp) SetAdmin(admin model.User) {
	r.roomInfo.Admin = admin
	r.self.Broadcast(serverMessage.NewSetRoomInfoMessage(r.roomInfo))
	r.roomManager.ChangeRoomInfo(r.roomInfo)
}
