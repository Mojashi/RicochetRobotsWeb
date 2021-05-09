package clientMessage

type JoinMessage struct {
	Type     Type   `json:"type"`
	Password string `json:"password"`
}

// func (m JoinMessage) GetUser() model.User {
// 	return m.User
// }

func (m JoinMessage) GetPassword() string {
	return m.Password
}
