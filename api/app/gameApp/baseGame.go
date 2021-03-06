package gameApp

import (
	"errors"
	"log"
	"time"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
)

type IBaseGameApp interface {
	app.IGameApp
	app.IProblemOutput
	StartProblem() error
	Broadcast(msg serverMessage.ServerMessage)
	Send(dest model.UserID, msg serverMessage.ServerMessage) error
	OnFinishProblem(pointDiff map[model.UserID]int)
	isFinish() bool
	getGameWinner() (model.User, bool)
	Join(user model.User)
	Leave(user model.User)
	Finish() error
}

type BaseGameApp struct {
	problemRepository repository.IProblemWithSolutionRepository
	output            app.IGameOutput

	problem app.IProblemApp
	model.GameState

	LeftParticipants map[model.UserID]model.User
	self             IBaseGameApp
}

func NewBaseGameApp(users map[model.UserID]model.User, conf model.GameConfig, output app.IGameOutput, problemRepository repository.IProblemWithSolutionRepository, self IBaseGameApp) *BaseGameApp {
	g := &BaseGameApp{
		output:            output,
		problemRepository: problemRepository,
		GameState:         *model.NewGameState(users, conf),
		LeftParticipants:  map[int]model.User{},
		self:              self,
	}
	if self == nil {
		g.self = g
	}
	return g
}

func (u *BaseGameApp) Run() error {
	u.output.Broadcast(serverMessage.NewSyncGameMessage(&u.GameState, u.LeftParticipants))
	err := u.self.StartProblem()
	if err != nil {
		return err
	}
	return nil
}

func (u *BaseGameApp) StartProblem() error {
	if !u.GameState.Interval {
		return errors.New("another problem has already been started")
	}

	var problem model.ProblemWithSolution
	var err error
	for {
		problem, err = u.problemRepository.GetUnusedWithConfig(u.Config.ProblemConfig, false)
		if err == nil {
			break
		}
		problem, err = u.problemRepository.GetUnusedWithConfig(u.Config.ProblemConfig, true)
		if err == nil {
			break
		}
		problem, err = u.problemRepository.GetUnused()
		if err == nil {
			break
		}
		log.Println("there is no problem!!" + err.Error())
		time.Sleep(10 * time.Second)
	}
	u.problemRepository.SetUsed(problem.ID)

	u.problem = app.NewProblemApp(problem, u.Config, u.self)
	u.GameState.Interval = false
	u.problem.SyncAll()
	return nil
}
func (u *BaseGameApp) SyncAll() error {
	u.output.Broadcast(serverMessage.NewSyncGameMessage(&u.GameState, u.LeftParticipants))
	return u.problem.SyncAll()
}
func (u *BaseGameApp) Sync(dest model.UserID) error {
	u.output.Send(dest, serverMessage.NewSyncGameMessage(&u.GameState, u.LeftParticipants))
	return u.problem.Sync(dest)
}

func (u *BaseGameApp) Join(user model.User) {
	if _, ok := u.GameState.Points[user.ID]; !ok {
		u.GameState.Points[user.ID] = 0
	}
	u.Participants[user.ID] = user
	delete(u.LeftParticipants, user.ID)
}
func (u *BaseGameApp) Leave(user model.User) {
	u.LeftParticipants[user.ID] = user
}

func (u *BaseGameApp) Finish() error {
	u.output.Broadcast(serverMessage.NewFinishGameMessage(&u.GameState))
	winner, _ := u.self.getGameWinner()
	u.output.OnFinishGame(winner)
	return nil
}

func (u *BaseGameApp) IsRoomAdmin(user model.User) bool {
	return u.output.IsRoomAdmin(user)
}

func (u *BaseGameApp) Reducer(user model.User, msg clientMessage.ClientMessage) error {
	switch msg.(type) {
	case clientMessage.JoinMessage:
		u.self.Join(user)
	case clientMessage.LeaveMessage:
		u.self.Leave(user)
	case clientMessage.NextProblemRequestMessage:
		if u.output.IsRoomAdmin(user) {
			u.self.StartProblem()
		}
	default:
		if !u.GameState.Interval {
			u.problem.Reducer(user, msg)
		}
	}
	return nil
}

func (u *BaseGameApp) Broadcast(msg serverMessage.ServerMessage) {
	u.output.Broadcast(msg)
}
func (u *BaseGameApp) Send(dest model.UserID, msg serverMessage.ServerMessage) error {
	return u.output.Send(dest, msg)
}

func (u *BaseGameApp) OnFinishProblem(pointDiff map[model.UserID]int) {
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

	if u.self.isFinish() {
		u.self.Finish()
	}
}

func (u *BaseGameApp) isFinish() bool {
	_, ret := u.self.getGameWinner()
	return ret
}

func (u *BaseGameApp) getGameWinner() (model.User, bool) {
	maxPoint := 0
	var maxPUser model.UserID
	for userID, pt := range u.Points {
		if maxPoint < pt {
			maxPoint = pt
			maxPUser = userID
		}
	}
	return u.Participants[maxPUser], maxPoint >= u.GameState.Config.GoalPoint
}
