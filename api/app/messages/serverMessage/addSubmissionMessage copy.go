package serverMessage

import (
	"github.com/Mojashi/RicochetRobots/api/model"
)

type SubmissionDto struct {
	ID        int             `json:"id"`
	UserID    model.UserID    `json:"userID"`
	Hands     model.Hands     `json:"hands"`
	TimeStamp model.TimeStamp `json:"timeStamp"`
	Optimal   bool            `json:"opt"`
}

func ToDto(s model.Submission) SubmissionDto {
	return SubmissionDto{
		ID:        s.ID,
		UserID:    s.User.ID,
		Hands:     s.Hands,
		TimeStamp: s.TimeStamp,
		Optimal:   s.Optimal,
	}
}

type AddSubmissionMessage struct {
	Type Type          `json:"type"`
	Sub  SubmissionDto `json:"sub"`
}

func NewAddSubmissionMessage(sub model.Submission) AddSubmissionMessage {
	return AddSubmissionMessage{
		Type: AddHiddenSubmission,
		Sub:  ToDto(sub),
	}
}
