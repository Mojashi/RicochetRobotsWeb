package model

type GameState struct {
	ID     int
	Config GameConfig

	Points   map[UserID]int
	Interval bool
}

func NewGameState(users map[UserID]User, conf GameConfig) *GameState {
	points := map[UserID]int{}
	for userID := range users {
		points[userID] = 0
	}

	return &GameState{
		Config:   conf,
		Points:   points,
		ID:       0,
		Interval: true,
	}
}
