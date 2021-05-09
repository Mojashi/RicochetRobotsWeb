package model

type RoomInfo struct {
	ID         int        `json:"id"`
	GameConfig GameConfig `json:"gameConfig"`
	Admin      User       `json:"admin"`
	OnGame     bool       `json:"onGame"`
	RoomSettings
}

type RoomSettings struct {
	Name     string `json:"name"`
	Private  bool   `json:"private"`
	Password string `json:"password"`
}
