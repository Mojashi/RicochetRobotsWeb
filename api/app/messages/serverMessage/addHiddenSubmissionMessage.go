package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type HiddenSubmissionDto struct {
	ID        int             `json:"id"`
	UserID    model.UserID    `json:"userID"`
	Length    int             `json:"length"`
	TimeStamp model.TimeStamp `json:"timeStamp"`
	Opt       bool            `json:"optimal"`
}

func ToHiddenDto(s model.Submission) HiddenSubmissionDto {
	return HiddenSubmissionDto{
		ID:        s.ID,
		UserID:    s.User.ID,
		Length:    len(s.Hands),
		TimeStamp: s.TimeStamp,
		Opt:       s.Optimal,
	}
}

type AddHiddenSubmissionMessage struct {
	Type Type                `json:"type"`
	Sub  HiddenSubmissionDto `json:"sub"`
}

func NewAddHiddenSubmissionMessage(sub model.Submission) AddHiddenSubmissionMessage {
	return AddHiddenSubmissionMessage{
		Type: AddHiddenSubmission,
		Sub:  ToHiddenDto(sub),
	}
}
