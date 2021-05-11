package app

import (
	"errors"

	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/Mojashi/RicochetRobots/api/utils"
)

type IGameApp interface { //かならず１スレッドからしか触られない前提(Roomが１個ずつしか通さないので)
	Join(user model.User)
	Leave(user model.User)
	Reducer(user model.User, msg clientMessage.ClientMessage) error
	Sync(dest model.UserID) error
	SyncAll() error
}

type IGameOutput interface {
	Broadcast(msg serverMessage.ServerMessage)
	Send(dest model.UserID, msg serverMessage.ServerMessage) error
	OnFinishGame()
	IsRoomAdmin(user model.User) bool
}

type GameApp struct {
	problemRepository repository.IProblemWithSolutionRepository
	output            IGameOutput

	problem IProblemApp
	model.GameState

	LeftParticipants map[model.UserID]model.User
}

func NewGameApp(users map[model.UserID]model.User, conf model.GameConfig, output IGameOutput, problemRepository repository.IProblemWithSolutionRepository) (IGameApp, error) {
	g := &GameApp{
		output:            output,
		problemRepository: problemRepository,
		GameState:         *model.NewGameState(users, conf),
		LeftParticipants:  map[int]model.User{},
	}
	return g, g.Init()
}

func (u *GameApp) Init() error {
	u.output.Broadcast(serverMessage.NewSyncGameMessage(&u.GameState, u.LeftParticipants))
	err := u.StartProblem()
	if err != nil {
		return err
	}
	return nil
}

func (u *GameApp) StartProblem() error {
	if !u.GameState.Interval {
		return errors.New("another problem has already been started")
	}
	problem, err := u.problemRepository.GetUnused()
	if err != nil {
		return err
	}
	u.problem = NewProblemApp(problem, u.Config, u)
	u.GameState.Interval = false
	u.problem.SyncAll()
	return nil
}
func (u *GameApp) SyncAll() error {
	u.output.Broadcast(serverMessage.NewSyncGameMessage(&u.GameState, u.LeftParticipants))
	return u.problem.SyncAll()
}
func (u *GameApp) Sync(dest model.UserID) error {
	u.output.Send(dest, serverMessage.NewSyncGameMessage(&u.GameState, u.LeftParticipants))
	return u.problem.Sync(dest)
}

func (u *GameApp) Join(user model.User) {
	if _, ok := u.GameState.Points[user.ID]; !ok {
		u.GameState.Points[user.ID] = 0
	}
	delete(u.LeftParticipants, user.ID)
}
func (u *GameApp) Leave(user model.User) {
	u.LeftParticipants[user.ID] = user
}

func (u *GameApp) Finish() error {
	u.output.Broadcast(serverMessage.NewFinishGameMessage(&u.GameState))
	return nil
}

func (u *GameApp) Reducer(user model.User, msg clientMessage.ClientMessage) error {
	switch msg.(type) {
	case clientMessage.JoinMessage:
		u.Join(user)
	case clientMessage.LeaveMessage:
		u.Leave(user)
	case clientMessage.NextProblemRequestMessage:
		if u.output.IsRoomAdmin(user) {
			u.StartProblem()
		}
	default:
		if !u.GameState.Interval {
			u.problem.Reducer(user, msg)
		}
	}
	return nil
}

func (u *GameApp) Broadcast(msg serverMessage.ServerMessage) {
	u.output.Broadcast(msg)
}
func (u *GameApp) Send(dest model.UserID, msg serverMessage.ServerMessage) error {
	return u.output.Send(dest, msg)
}
func (u *GameApp) OnFinishProblem(pointDiff map[model.UserID]int) {
	u.Interval = true
	msgs := []serverMessage.SetPointMessage{}
	for userID, diff := range pointDiff {
		bef, ok := u.Points[userID]
		nex := diff
		if ok {
			nex = bef + diff
		}
		u.Points[userID] = nex
		msgs = append(msgs, serverMessage.NewSetPointMessage(userID, nex))
	}
	u.output.Broadcast(msgs)

	if u.isFinish() {
		u.Finish()
	}
	// else {
	// 	time.AfterFunc(10*time.Second, func() { u.StartProblem() })
	// }
}

func (u *GameApp) isFinish() bool {
	maxPoint := 0
	for _, pt := range u.Points {
		maxPoint = utils.Max(maxPoint, pt)
	}
	return maxPoint > u.GameState.Config.GoalPoint
}
