package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type ResultSubmissionDto struct {
	SubmissionDto
	SolHash    model.SolutionHash `json:"solHash"`
	AddedPoint int                `json:"addedPoint"`
}

type FinishProblemMessage struct {
	Type Type                  `json:"type"`
	Subs []ResultSubmissionDto `json:"subs"`
}

func NewFinishProblemMessage(result []model.ResultSubmission) FinishProblemMessage {
	subs := []ResultSubmissionDto{}
	for _, sub := range result {
		subs = append(subs, ResultSubmissionDto{
			SubmissionDto: ToDto(sub.Submission),
			SolHash:       sub.SolHash,
			AddedPoint:    sub.AddedPoint,
		})
	}
	return FinishProblemMessage{
		Type: FinishProblem,
		Subs: subs,
	}
}
