package clientMessage

type DeleteRoomMessage struct {
	Type Type `json:"type"`
}

func NewDelteRoomMessage() DeleteRoomMessage {
	return DeleteRoomMessage{
		Type: DeleteRoom,
	}
}
