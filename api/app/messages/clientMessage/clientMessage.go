package clientMessage

import (
	"encoding/json"
	"errors"
)

type ClientMessage interface {
}

func ToClientMessage(msg []byte) (ClientMessage, error) {
	var v interface{}
	err := json.Unmarshal(msg, &v)
	if err != nil {
		return nil, err
	}

	mp, ok := v.(map[string]interface{})
	if !ok {
		return nil, errors.New("failed to cast")
	}
	btype, ok := mp["type"]
	if !ok {
		return nil, errors.New("invalid format")
	}
	mtype, ok := btype.(float64)
	if !ok {
		return nil, errors.New("invalid format")
	}

	var m ClientMessage
	switch Type(mtype) {
	case Join:
		var smsg JoinMessage
		err = json.Unmarshal(msg, &smsg)
		m = smsg
	case Leave:
		var smsg LeaveMessage
		err = json.Unmarshal(msg, &smsg)
		m = smsg
	case Submit:
		var smsg SubmitMessage
		err = json.Unmarshal(msg, &smsg)
		m = smsg
	case StartGame:
		var smsg StartGameRequestMessage
		err = json.Unmarshal(msg, &smsg)
		m = smsg
	case NextProblem:
		var smsg NextProblemRequestMessage
		err = json.Unmarshal(msg, &smsg)
		m = smsg
	case SetGameSettings:
		var smsg SetGameSettingsMessage
		err = json.Unmarshal(msg, &smsg)
		m = smsg
	case RequestHint:
		var smsg RequestHintMessage
		err = json.Unmarshal(msg, &smsg)
		m = smsg
	default:
		err = errors.New("unknown message")
	}
	if err != nil {
		return nil, err
	}
	return m, nil
}

type Type = int

const (
	Join            Type = 0
	Leave           Type = 1
	Submit          Type = 2
	StartGame       Type = 3
	NextProblem     Type = 4
	DeleteRoom      Type = 5
	SetGameSettings Type = 6
	RequestHint     Type = 7
)
