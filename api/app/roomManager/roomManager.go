package roomManager

import (
	"errors"
	"sync"
	"sync/atomic"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/app/roomApp"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/Mojashi/RicochetRobots/api/twitter"
)

type RoomAbstractMtx struct {
	model.RoomAbstract
	mtx sync.RWMutex
}

type RoomManager struct {
	//AppsとInfosは大してシンクロしている必要ないのでロック別でもいい
	roomMtx   *sync.RWMutex
	roomApps  map[int]app.IRoomApp
	roomInfos map[int]*RoomAbstractMtx

	roomCount         int32
	problemRepository repository.IProblemWithSolutionRepository

	twApi twitter.TwitterAPI
}

func NewRoomManager(problemRepository repository.IProblemWithSolutionRepository, twApi twitter.TwitterAPI) app.IRoomManager {
	ret := &RoomManager{
		roomMtx:           &sync.RWMutex{},
		roomApps:          map[int]app.IRoomApp{},
		roomInfos:         map[int]*RoomAbstractMtx{},
		roomCount:         0,
		problemRepository: problemRepository,
		twApi:             twApi,
	}
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

	room := roomApp.NewArenaRoomApp(roomInfo, m, m.problemRepository, m.twApi, nil)

	m.roomMtx.Lock()
	m.roomApps[roomInfo.ID] = room
	m.roomInfos[roomInfo.ID] = &RoomAbstractMtx{
		RoomAbstract: roomInfo.ToAbstract(map[int]model.User{}),
		mtx:          sync.RWMutex{},
	}
	m.roomMtx.Unlock()

	room.Run()
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
	room := roomApp.NewUserMadeRoomApp(roomInfo, m, m.problemRepository, nil)
	m.roomApps[roomInfo.ID] = room

	m.roomInfos[roomInfo.ID] = &RoomAbstractMtx{
		RoomAbstract: roomInfo.ToAbstract(map[int]model.User{}),
		mtx:          sync.RWMutex{},
	}

	room.Run()
	return roomInfo.ID, nil
}

func (m *RoomManager) Delete(id int) {
	m.roomMtx.Lock()
	defer m.roomMtx.Unlock()

	room, ok := m.roomApps[id]
	if !ok {
		return
	}
	app.SendDelete(room)

	delete(m.roomInfos, id)
	delete(m.roomApps, id)
}

func (m *RoomManager) Get(id int) (app.IRoomApp, error) {
	m.roomMtx.RLock()
	defer m.roomMtx.RUnlock()

	room, ok := m.roomApps[id]
	if !ok {
		return nil, errors.New("room not found")
	}
	return room.(app.IRoomApp), nil
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
