package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type SetProblemMessage struct {
	Type    Type          `json:"type"`
	Problem model.Problem `json:"problem"`
}

func NewSetProblemMessage(problem model.Problem) SetProblemMessage {
	return SetProblemMessage{
		Type:    SetProblem,
		Problem: problem,
	}
}
