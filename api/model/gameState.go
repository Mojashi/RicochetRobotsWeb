package model

import (
	"sync"

	"github.com/Mojashi/RicochetRobots/api/utils"
)

type GameState struct {
	ID     int
	Config GameConfig

	Participants sync.Map //map[userID]user roomとは違って、一度でも参加したらずっと
	Points       sync.Map
	Interval     bool
}

func NewGameState(users *sync.Map, conf GameConfig) *GameState {
	points := sync.Map{}
	users.Range(func(key, value interface{}) bool {
		points.Store(key, 0)
		return true
	})

	return &GameState{
		Config:       conf,
		Participants: *utils.CopySyncMap(users),
		Points:       points,
		ID:           0,
		Interval:     false,
	}
}
