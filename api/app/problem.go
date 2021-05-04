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
}

type IProblemOutput interface {
	Broadcast(msg serverMessage.ServerMessage)
	Send(dest model.UserID, msg serverMessage.ServerMessage) error
	OnFinishProblem(pointDiff map[model.UserID]int)
}

type ProblemApp struct {
	output IProblemOutput
	model.ProblemState
}

func NewProblemApp(problem model.ProblemWithSolution, output IProblemOutput) IProblemApp {
	return &ProblemApp{
		output:       output,
		ProblemState: model.NewProblemState(problem),
	}
}

func (a *ProblemApp) SyncAll() error {
	a.output.Broadcast(serverMessage.NewSyncProblemMessage(&a.ProblemState))
	return nil
}
func (a *ProblemApp) Sync(dest model.UserID) error {
	a.output.Send(dest, serverMessage.NewSyncProblemMessage(&a.ProblemState))
	return nil
}

func (a *ProblemApp) Submit(sub model.Submission) error {
	if !a.Problem.IsValid(sub.Hands) {
		return errors.New("invalid solution")
	}
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
	a.output.Broadcast(serverMessage.NewStartTimelimitMessage(10))
	time.AfterFunc(10*time.Second, func() {
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
	optSubs := []model.Submission{}
	for _, sub := range ranking {
		if sub.Optimal {
			optSubs = append(optSubs, sub)
		}
	}
	a.output.Broadcast(serverMessage.NewFinishProblemMessage(optSubs))
	a.output.OnFinishProblem(a.CalcPointDiff(ranking))
}
func (a *ProblemApp) CalcPointDiff(ranking []model.Submission) map[model.UserID]int {
	diff := map[model.UserID]int{}
	if len(ranking) == 0 {
		return diff
	}
	for _, sub := range ranking {
		if sub.Optimal {
			diff[ranking[0].User.ID] = 3
		}
	}
	if ranking[0].Optimal {
		diff[ranking[0].User.ID] = 10
	}
	return diff
}
func (a *ProblemApp) Reducer(user model.User, msg clientMessage.ClientMessage) error {
	switch m := msg.(type) {
	case clientMessage.SubmitMessage:
		a.Submit(m.GetSubmission(user, len(a.Problem.Solution)))
	}
	return nil
}
