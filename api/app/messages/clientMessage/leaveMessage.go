package clientMessage

type LeaveMessage struct {
	Type Type `json:"type"`
}

func NewClientLeaveMessage() LeaveMessage {
	return LeaveMessage{
		Type: Leave,
	}
}
