package serverMessage

type StartTimelimitMessage struct {
	Type     Type `json:"type"`
	TimeLeft int  `json:"timeLeft"`
}

func NewStartTimelimitMessage(timeLeft int) StartTimelimitMessage {
	return StartTimelimitMessage{
		Type:     StartTimelimit,
		TimeLeft: timeLeft,
	}
}
