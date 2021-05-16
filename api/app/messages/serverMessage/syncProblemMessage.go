package serverMessage

import (
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/utils"
)

type SyncProblemMessage []ServerMessage

func NewSyncProblemMessage(p *model.ProblemState) SyncProblemMessage {
	msgs := SyncProblemMessage{}
	msgs = append(msgs, NewSetProblemMessage(p.Problem.Problem))
	if p.Shortest != nil {
		msgs = append(msgs, NewSetShortestMessage(*p.Shortest))
	}

	for _, sub := range p.Submissions[utils.Max(0, len(p.Submissions)-3):len(p.Submissions)] {
		msgs = append(msgs, NewAddHiddenSubmissionMessage(sub))
	}

	msgs = append(msgs, NewSetHintMessage(p.Problem.Solution[0:p.HintCount]))
	return msgs
}
