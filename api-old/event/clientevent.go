package game

type ClientEvent interface {
	handle()
}

type SubmitCEvent struct {
	GameID int    `json:"game_id"`
	Hands  []Hand `json:"hands"`
}

type JoinCEvent struct {
	UserID int
}

type LeaveCEvent struct {
	UserID int
}