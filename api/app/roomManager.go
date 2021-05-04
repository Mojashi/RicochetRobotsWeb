package app

import (
	"errors"
	"sync"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
)

type IRoomManager interface {
	NewRoom() IRoomApp
	Get(id int) (IRoomApp, error)
	Delete(id int) error
	Join(id int, c Client) error
}

type RoomManager struct {
	rooms             *sync.Map //map[int]IRoomApp
	problemRepository repository.IProblemWithSolutionRepository
}

func NewRoomManager(problemRepository repository.IProblemWithSolutionRepository) IRoomManager {
	return &RoomManager{rooms: &sync.Map{}, problemRepository: problemRepository}
}

func (m RoomManager) NewRoom() IRoomApp {
	// room, _ := m.RoomRepository.Create(model.Room{Name: ""})
	roomInfo := model.RoomInfo{
		ID:         0,
		Name:       "test_room",
		GameConfig: model.GameConfig{},
		OnGame:     false,
	}
	room := NewRoomApp(roomInfo, m.problemRepository)
	m.rooms.Store(roomInfo.ID, room)
	return room
}

func (m RoomManager) Join(id int, c Client) error {
	room, err := m.Get(id)
	if err != nil {
		return err
	}
	return room.(IRoomApp).Join(c)
}

func (m RoomManager) Delete(id int) error {
	room, err := m.Get(id)
	if err != nil {
		return err
	}
	room.Delete()
	return nil
}

func (m RoomManager) Get(id int) (IRoomApp, error) {
	room, ok := m.rooms.Load(id)
	if !ok {
		return nil, errors.New("room not fount")
	}
	return room.(IRoomApp), nil
}
