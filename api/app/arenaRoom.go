package app

import (
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
)

type ArenaRoomApp struct {
	RoomApp
}

func NewArenaRoomApp(
	room model.RoomInfo,
	roomManager IRoomObserver,
	problemRepository repository.IProblemWithSolutionRepository,
) IRoomApp {
	roomApp := &ArenaRoomApp{
		RoomApp: RoomApp{
			participants:      map[model.UserID]Client{},
			msgChan:           make(chan MsgWithSender, 100),
			roomInfo:          room,
			problemRepository: problemRepository,
			roomManager:       roomManager,
		},
	}
	roomApp.Run()
	return roomApp
}

func (r *ArenaRoomApp) Run() error {
	r.RoomApp.Run()
	r.SetGameConfig(model.GameConfig{})
	r.StartGame()
	return nil
}

func (r *ArenaRoomApp) OnFinishGame() {
	r.SetOnGame(false)
}
