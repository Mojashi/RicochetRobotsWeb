package serverMessage

type UnauthMessage struct {
	Type Type `json:"type"`
}

func NewUnauthMessage() UnauthMessage {
	return UnauthMessage{
		Type: UnauthError,
	}
}
