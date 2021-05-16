package serverMessage

type NotifyMessage struct {
	Type Type   `json:"type"`
	Msg  string `json:"msg"`
}

func NewNotifyMessage(msg string) NotifyMessage {
	return NotifyMessage{
		Type: Notify,
		Msg:  msg,
	}
}
