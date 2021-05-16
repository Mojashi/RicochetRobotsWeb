package clientMessage

import (
	"time"

	"github.com/Mojashi/RicochetRobots/api/model"
)

type SubmitMsgDto struct {
	Hands model.Hands `json:"hands"`
}

type SubmitMessage struct {
	Type Type         `json:"type"`
	Sub  SubmitMsgDto `json:"sub"`
}

func NewSubmitMessage(hands model.Hands) SubmitMessage {
	return SubmitMessage{
		Type: Submit,
		Sub: SubmitMsgDto{
			Hands: hands,
		},
	}
}

func (m SubmitMessage) GetSubmission(user model.User, optLen int) model.Submission {
	return model.Submission{
		ID:        -1,
		User:      user,
		Hands:     m.Sub.Hands,
		Length:    len(m.Sub.Hands),
		TimeStamp: model.TimeStamp(time.Now().Unix()),
		Optimal:   optLen == len(m.Sub.Hands),
	}
}
