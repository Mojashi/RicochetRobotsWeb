package app

import (
	"sync"
	"time"

	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/Mojashi/RicochetRobots/api/utils"
)

type IGameApp interface {
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
}

type GameApp struct {
	problemRepository repository.IProblemWithSolutionRepository
	output            IGameOutput

	problem IProblemApp
	model.GameState
}

func NewGameApp(users *sync.Map, conf model.GameConfig, output IGameOutput, problemRepository repository.IProblemWithSolutionRepository) (IGameApp, error) {
	g := &GameApp{
		output:            output,
		problemRepository: problemRepository,
		GameState:         *model.NewGameState(users, conf),
	}
	return g, g.Init()
}

func (u *GameApp) Init() error {
	err := u.StartProblem()
	if err != nil {
		return err
	}
	u.SyncAll()
	return nil
}

func (u *GameApp) StartProblem() error {
	problem, err := u.problemRepository.GetUnused()
	if err != nil {
		return err
	}
	u.problem = NewProblemApp(problem, u)
	u.GameState.Interval = false
	u.problem.SyncAll()
	return nil
}
func (u *GameApp) SyncAll() error {
	u.output.Broadcast(serverMessage.NewSyncGameMessage(&u.GameState))
	if !u.GameState.Interval {
		return u.problem.SyncAll()
	}
	return nil
}
func (u *GameApp) Sync(dest model.UserID) error {
	u.output.Send(dest, serverMessage.NewSyncGameMessage(&u.GameState))
	if !u.GameState.Interval {
		return u.problem.Sync(dest)
	}
	return nil
}

func (u *GameApp) Join(user model.User) {
	_, exists := u.GameState.Participants.LoadOrStore(user.ID, user)
	if !exists {
		u.Sync(user.ID)
		u.output.Broadcast(serverMessage.NewJoinMessage(user))
	}
}
func (u *GameApp) Leave(user model.User) {
	// _, exists := u.game.Participants.LoadAndDelete(user.ID)
	// if exists {
	// 	u.output.Broadcast(serverMessage.NewLeaveMessage(user))
	// }
}

func (u *GameApp) Finish() error {
	u.output.Broadcast(serverMessage.NewFinishGameMessage(&u.GameState))
	return nil
}

func (u *GameApp) Reducer(user model.User, msg clientMessage.ClientMessage) error {
	switch m := msg.(type) {
	case clientMessage.JoinMessage:
		u.Join(m.GetUser())
	case clientMessage.LeaveMessage:
		u.Leave(m.GetUser())
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
	msgs := []serverMessage.SetPointMessage{}
	for userID, diff := range pointDiff {
		bef, ok := u.Points.Load(userID)
		nex := diff
		if ok {
			nex = bef.(int) + diff
		}
		u.Points.Store(userID, nex)
		msgs = append(msgs, serverMessage.NewSetPointMessage(userID, nex))
	}
	u.output.Broadcast(msgs)

	if u.isFinish() {
		time.AfterFunc(10*time.Second, func() { u.Finish() })
	} else {
		time.AfterFunc(10*time.Second, func() { u.StartProblem() })
	}
}

func (u *GameApp) isFinish() bool {
	maxPoint := 0
	u.Points.Range(func(_, pt interface{}) bool {
		maxPoint = utils.Max(maxPoint, pt.(int))
		return true
	})
	return maxPoint > 15
}
