package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type SetPointMessage struct {
	Type   Type         `json:"type"`
	UserID model.UserID `json:"userID"`
	Point  int          `json:"point"`
}

func NewSetPointMessage(userID model.UserID, point int) SetPointMessage {
	return SetPointMessage{
		Type:   UpdatePoint,
		UserID: userID,
		Point:  point,
	}
}
