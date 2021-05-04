package serverMessage

import "github.com/Mojashi/RicochetRobots/api/model"

type LeaveMessage struct {
	Type   Type         `json:"type"`
	UserID model.UserID `json:"userID"`
}

func NewLeaveMessage(user model.User) LeaveMessage {
	return LeaveMessage{
		Type:   Leave,
		UserID: user.ID,
	}
}
