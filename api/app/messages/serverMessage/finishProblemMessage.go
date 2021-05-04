package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type FinishProblemMessage struct {
	Type Type            `json:"type"`
	Subs []SubmissionDto `json:"subs"`
}

func NewFinishProblemMessage(result []model.Submission) FinishProblemMessage {
	subs := []SubmissionDto{}
	for _, sub := range result {
		subs = append(subs, ToDto(sub))
	}
	return FinishProblemMessage{
		Type: FinishProblem,
		Subs: subs,
	}
}
