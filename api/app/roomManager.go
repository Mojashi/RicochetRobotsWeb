package app

import (
	"errors"
	"sync"
	"sync/atomic"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
)

type IRoomManager interface {
	NewRoom(user model.User, settings model.RoomSettings) (int, error)
	Get(id int) (IRoomApp, error)
	Delete(id int) error
	Join(id int, c Client) error
}

type RoomManager struct {
	roomApps          sync.Map //map[int]IRoomApp
	roomCount         int32
	problemRepository repository.IProblemWithSolutionRepository
}

func NewRoomManager(problemRepository repository.IProblemWithSolutionRepository) IRoomManager {
	return &RoomManager{roomApps: sync.Map{}, roomCount: 0, problemRepository: problemRepository}
}

func (m *RoomManager) NewRoom(user model.User, settings model.RoomSettings) (int, error) {
	// room, _ := m.RoomRepository.Create(model.Room{Name: ""})
	roomInfo := model.RoomInfo{
		ID:           int(atomic.AddInt32(&m.roomCount, 1)),
		Admin:        user,
		GameConfig:   model.GameConfig{},
		OnGame:       false,
		RoomSettings: settings,
	}
	room := NewRoomApp(roomInfo, m.problemRepository)
	m.roomApps.Store(roomInfo.ID, room)
	return roomInfo.ID, nil
}

func (m *RoomManager) Join(id int, c Client) error {
	room, err := m.Get(id)
	if err != nil {
		return err
	}
	return room.(IRoomApp).Join(c)
}

func (m *RoomManager) Delete(id int) error {
	room, err := m.Get(id)
	if err != nil {
		return err
	}
	room.Delete()
	return nil
}

func (m *RoomManager) Get(id int) (IRoomApp, error) {
	room, ok := m.roomApps.Load(id)
	if !ok {
		return nil, errors.New("room not fount")
	}
	return room.(IRoomApp), nil
}
