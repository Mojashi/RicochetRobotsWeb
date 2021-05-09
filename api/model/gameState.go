package model

import (
	"sync"
)

type GameState struct {
	ID     int
	Config GameConfig

	Points   sync.Map
	Interval bool
}

func NewGameState(users *sync.Map, conf GameConfig) *GameState {
	points := sync.Map{}
	users.Range(func(key, value interface{}) bool {
		points.Store(key, 0)
		return true
	})

	return &GameState{
		Config:   conf,
		Points:   points,
		ID:       0,
		Interval: true,
	}
}
