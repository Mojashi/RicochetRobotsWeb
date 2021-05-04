package model

type RoomInfo struct {
	ID         int        `json:"id"`
	Name       string     `json:"name"`
	GameConfig GameConfig `json:"gameConfig"`

	OnGame bool `json:"onGame"`
}
