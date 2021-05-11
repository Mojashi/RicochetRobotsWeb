package clientMessage

type JoinMessage struct {
	Type     Type   `json:"type"`
	Password string `json:"password"`
}

func NewClientJoinMessage(password string) JoinMessage {
	return JoinMessage{
		Type:     Join,
		Password: password,
	}
}

func (m JoinMessage) GetPassword() string {
	return m.Password
}
