package serverMessage

type NotifyMessage struct {
	Type     Type   `json:"type"`
	Msg      string `json:"msg"`
	Duration int    `json:"duration"`
}

func NewNotifyMessage(msg string, duration int) NotifyMessage {
	return NotifyMessage{
		Type:     Notify,
		Msg:      msg,
		Duration: duration,
	}
}
