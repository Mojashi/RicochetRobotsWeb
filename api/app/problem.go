package app

import (
	"errors"
	"sort"
	"time"

	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
)

type IProblemApp interface {
	Finish()
	Submit(sub model.Submission) error
	Reducer(user model.User, msg clientMessage.ClientMessage) error
	Sync(dest model.UserID) error
	SyncAll() error
	GetProblem() model.ProblemWithSolution
	SuggestHint() error
}

type IProblemOutput interface {
	Broadcast(msg serverMessage.ServerMessage)
	Send(dest model.UserID, msg serverMessage.ServerMessage) error
	OnFinishProblem(pointDiff map[model.UserID]int)
	IsRoomAdmin(user model.User) bool
}

type ProblemApp struct {
	output IProblemOutput
	model.ProblemState
	gameConfig model.GameConfig

	finishProblemMessage *serverMessage.FinishProblemMessage
}

func NewProblemApp(problem model.ProblemWithSolution, gameConfig model.GameConfig, output IProblemOutput) IProblemApp {
	return &ProblemApp{
		output:       output,
		gameConfig:   gameConfig,
		ProblemState: model.NewProblemState(problem),
	}
}

func (a *ProblemApp) GetProblem() model.ProblemWithSolution {
	return a.Problem
}

func (a *ProblemApp) SyncAll() error {
	a.output.Broadcast(serverMessage.NewSyncProblemMessage(&a.ProblemState))
	return nil
}
func (a *ProblemApp) Sync(dest model.UserID) error {
	a.output.Send(dest, serverMessage.NewSyncProblemMessage(&a.ProblemState))
	if a.finishProblemMessage != nil {
		a.output.Send(dest, a.finishProblemMessage)
	}
	return nil
}

func (a *ProblemApp) Submit(sub model.Submission) error {
	if a.finishProblemMessage != nil {
		return errors.New("game has already been finished")
	}
	if !a.Problem.IsValid(sub.Hands) {
		return errors.New("invalid solution")
	}
	sub.ID = len(a.Submissions) //提出の永続化はあとでやるのでいまは適当なID
	a.Submissions = append(a.Submissions, sub)
	if a.Shortest == nil || sub.Length < a.Shortest.Length {
		a.output.Broadcast(serverMessage.NewSetShortestMessage(sub))
		a.Shortest = &sub
	}
	if sub.Optimal && !a.Timelimit {
		a.StartTimelimit()
	}
	a.output.Broadcast(serverMessage.NewAddHiddenSubmissionMessage(sub))

	return nil
}

func (a *ProblemApp) StartTimelimit() {
	if a.Timelimit {
		return
	}
	a.Timelimit = true
	a.output.Broadcast(serverMessage.NewStartTimelimitMessage(a.gameConfig.Timelimit))
	time.AfterFunc(time.Duration(a.gameConfig.Timelimit)*time.Second, func() {
		a.Finish()
	})
}

func (a *ProblemApp) Finish() {
	ranking := a.Submissions[:]
	sort.SliceStable(ranking, func(i, j int) bool {
		if ranking[i].Length == ranking[j].Length {
			return ranking[i].TimeStamp < ranking[j].TimeStamp
		}
		return ranking[i].Length < ranking[j].Length
	})
	pointDiffs := a.CalcPointDiff(ranking)
	al := map[model.UserID]bool{}

	optSubs := []model.ResultSubmission{}
	for _, sub := range ranking {
		if sub.Optimal {
			ap := pointDiffs[sub.User.ID]
			if al[sub.User.ID] {
				ap = 0
			}
			al[sub.User.ID] = true
			optSubs = append(optSubs, model.ResultSubmission{
				Submission: sub,
				SolHash:    sub.Hands.Hash(a.Problem.Problem),
				AddedPoint: ap,
			})
		}
	}
	buf := serverMessage.NewFinishProblemMessage(optSubs)
	a.finishProblemMessage = &buf

	a.output.Broadcast(a.finishProblemMessage)
	a.output.OnFinishProblem(pointDiffs)
}
func (a *ProblemApp) CalcPointDiff(ranking []model.Submission) map[model.UserID]int {
	diff := map[model.UserID]int{}
	if len(ranking) == 0 {
		return diff
	}
	for _, sub := range ranking {
		if sub.Optimal {
			diff[sub.User.ID] = a.gameConfig.PointForOther
		}
	}
	if ranking[0].Optimal {
		diff[ranking[0].User.ID] = a.gameConfig.PointForFirst
	}
	return diff
}
func (a *ProblemApp) SuggestHint() error {
	if a.HintCount == len(a.Problem.Solution) {
		return errors.New("all hints are suggested")
	}
	a.HintCount++
	a.output.Broadcast(serverMessage.NewSetHintMessage(a.Problem.Solution[0:a.HintCount]))
	return nil
}
func (a *ProblemApp) Reducer(user model.User, msg clientMessage.ClientMessage) error {
	switch m := msg.(type) {
	case clientMessage.SubmitMessage:
		a.Submit(m.GetSubmission(user, len(a.Problem.Solution)))
	case clientMessage.RequestHintMessage:
		if a.output.IsRoomAdmin(user) {
			a.SuggestHint()
		}
	default:
		return errors.New("unknown messageType")
	}
	return nil
}
