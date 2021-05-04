package serverMessage

type StartGameMessage struct {
	Type   Type `json:"type"`
	GameID int  `json:"gameID"`
}

func NewStartGameMessage(gameID int) StartGameMessage {
	return StartGameMessage{
		Type:   StartGame,
		GameID: gameID,
	}
}
