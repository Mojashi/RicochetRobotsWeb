package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type SetShortestMessage struct {
	Type     Type                `json:"type"`
	Shortest HiddenSubmissionDto `json:"sub"`
}

func NewSetShortestMessage(sub model.Submission) SetShortestMessage {
	return SetShortestMessage{
		Type:     SetShortest,
		Shortest: ToHiddenDto(sub),
	}
}
