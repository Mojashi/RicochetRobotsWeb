package arena

type ServerEvent struct {
	EventName string `json:"event_name"`

	Start  *StartSEvent  `json:"start"`
	Submit *SubmitSEvent `json:"submit"`
	Finish *FinishSEvent `json:"finish"`
	Join   *JoinSEvent   `json:"join"`
}

type StartSEvent struct {
}

type FinishSEvent struct {
}

type SubmitSEvent struct {
}

type JoinSEvent struct {
}
