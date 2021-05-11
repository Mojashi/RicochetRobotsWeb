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
	Delete(id int)
	GetRoomList() []model.RoomAbstract
}
type RoomAbstractMtx struct {
	model.RoomAbstract
	mtx sync.RWMutex
}

type RoomManager struct {
	//AppsとInfosは大してシンクロしている必要ないのでロック別でもいい
	roomMtx   *sync.RWMutex
	roomApps  map[int]IRoomApp
	roomInfos map[int]*RoomAbstractMtx

	roomCount         int32
	problemRepository repository.IProblemWithSolutionRepository
}

func NewRoomManager(problemRepository repository.IProblemWithSolutionRepository) IRoomManager {
	ret := &RoomManager{
		roomMtx:           &sync.RWMutex{},
		roomApps:          map[int]IRoomApp{},
		roomInfos:         map[int]*RoomAbstractMtx{},
		roomCount:         0,
		problemRepository: problemRepository,
	}
	ret.NewArena()
	return ret
}

func (m *RoomManager) ChangeRoomInfo(roomInfo model.RoomInfo) {
	m.roomMtx.RLock()
	defer m.roomMtx.RUnlock()
	room, ok := m.roomInfos[roomInfo.ID]
	if !ok {
		return
	}

	room.mtx.Lock()
	defer room.mtx.Unlock()
	room.RoomAbstract = roomInfo.ToAbstract(room.Participants)
}
func (m *RoomManager) AddParticipant(id int, user model.User) {
	m.roomMtx.RLock()
	defer m.roomMtx.RUnlock()
	room, ok := m.roomInfos[id]
	if !ok {
		return
	}

	room.mtx.Lock()
	defer room.mtx.Unlock()
	room.RoomAbstract.Participants[user.ID] = user
}
func (m *RoomManager) RemoveParticipant(id int, user model.User) {
	m.roomMtx.RLock()
	defer m.roomMtx.RUnlock()
	room, ok := m.roomInfos[id]
	if !ok {
		return
	}

	room.mtx.Lock()
	defer room.mtx.Unlock()
	delete(room.RoomAbstract.Participants, user.ID)
}

func (m *RoomManager) NewArena() (int, error) {
	m.roomMtx.Lock()
	defer m.roomMtx.Unlock()
	// room, _ := m.RoomRepository.Create(model.Room{Name: ""})
	roomInfo := model.RoomInfo{
		ID:         0,
		Admin:      model.SuperUser,
		GameConfig: model.GameConfig{},
		OnGame:     false,
		RoomSettings: model.RoomSettings{
			Name:    "アリーナ",
			Private: false,
		},
	}
	atomic.AddInt32(&m.roomCount, 1)

	room := NewRoomApp(roomInfo, m, m.problemRepository)
	m.roomApps[roomInfo.ID] = room

	m.roomInfos[roomInfo.ID] = &RoomAbstractMtx{
		RoomAbstract: roomInfo.ToAbstract(map[int]model.User{}),
		mtx:          sync.RWMutex{},
	}
	return roomInfo.ID, nil
}

func (m *RoomManager) NewRoom(user model.User, settings model.RoomSettings) (int, error) {
	m.roomMtx.Lock()
	defer m.roomMtx.Unlock()
	// room, _ := m.RoomRepository.Create(model.Room{Name: ""})
	roomInfo := model.RoomInfo{
		ID:           int(atomic.AddInt32(&m.roomCount, 1)),
		Admin:        user,
		GameConfig:   model.GameConfig{},
		OnGame:       false,
		RoomSettings: settings,
	}
	room := NewRoomApp(roomInfo, m, m.problemRepository)
	m.roomApps[roomInfo.ID] = room

	m.roomInfos[roomInfo.ID] = &RoomAbstractMtx{
		RoomAbstract: roomInfo.ToAbstract(map[int]model.User{}),
		mtx:          sync.RWMutex{},
	}
	return roomInfo.ID, nil
}

func (m *RoomManager) Delete(id int) {
	m.roomMtx.Lock()
	defer m.roomMtx.Unlock()

	room, ok := m.roomApps[id]
	if !ok {
		return
	}
	room.SendDelete()

	delete(m.roomInfos, id)
	delete(m.roomApps, id)
}

func (m *RoomManager) Get(id int) (IRoomApp, error) {
	m.roomMtx.RLock()
	defer m.roomMtx.RUnlock()

	room, ok := m.roomApps[id]
	if !ok {
		return nil, errors.New("room not found")
	}
	return room.(IRoomApp), nil
}

func (m *RoomManager) GetRoomList() []model.RoomAbstract {
	m.roomMtx.RLock()
	defer m.roomMtx.RUnlock()

	rooms := []model.RoomAbstract{}
	for _, room := range m.roomInfos {
		rooms = append(rooms, room.RoomAbstract.Copy())
	}
	return rooms
}
