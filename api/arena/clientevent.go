package arena

type ClientEvent struct {
	EventName string `json:"event_name"`

	Submit *SubmitCEvent `json:"submit"`
	Join   *JoinCEvent   `json:"join"`
}

type SubmitCEvent struct {
}

type JoinCEvent struct {
}
