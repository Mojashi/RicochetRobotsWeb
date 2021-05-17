package model

type GameState struct {
	ID     int
	Config GameConfig

	Points       map[UserID]int
	Participants map[UserID]User
	Interval     bool
}

func NewGameState(users map[UserID]User, conf GameConfig) *GameState {
	points := map[UserID]int{}
	participants := map[UserID]User{}
	for userID, user := range users {
		participants[userID] = user
		points[userID] = 0
	}

	return &GameState{
		Config:       conf,
		Points:       points,
		Participants: participants,
		ID:           0,
		Interval:     true,
	}
}
