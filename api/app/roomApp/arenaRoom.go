package roomApp

import (
	"strconv"
	"time"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/app/gameApp"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/Mojashi/RicochetRobots/api/twitter"
)

type IArenaRoomApp interface {
	IUserMadeRoomApp
}

type ArenaRoomApp struct {
	*UserMadeRoomApp
	self       IArenaRoomApp
	arenaCount int
	twApi      twitter.TwitterAPI
}

var arenaConf = model.GameConfig{
	Rule:          model.FirstToWin,
	Timelimit:     10,
	GoalPoint:     10,
	PointForFirst: 10,
	PointForOther: 5,
	SolLenMin:     4,
	SolLenMax:     999,
}

func NewArenaRoomApp(
	room model.RoomInfo,
	roomManager app.IRoomObserver,
	problemRepository repository.IProblemWithSolutionRepository,
	twApi twitter.TwitterAPI,
	self IArenaRoomApp,
) *ArenaRoomApp {
	roomApp := &ArenaRoomApp{
		arenaCount: 0,
		twApi:      twApi,
	}
	if self == nil {
		self = roomApp
	}
	roomApp.self = self
	roomApp.UserMadeRoomApp = NewUserMadeRoomApp(room, roomManager, problemRepository, self)
	return roomApp
}

func (r *ArenaRoomApp) Run() error {
	r.self.SetGameConfig(arenaConf)
	r.self.StartGame()

	//Run、つまりReducerを動かすのは最後じゃないと、StartGameとメッセージの処理が同時に走っちゃうかもしれない
	r.UserMadeRoomApp.Run()
	return nil
}

func (r *ArenaRoomApp) StartGame() error {
	r.arenaCount++
	r.self.Broadcast(serverMessage.NewNotifyMessage("ラウンド" + strconv.Itoa(r.arenaCount)))

	r.self.SetOnGame(true)

	var err error
	r.gameApp = gameApp.NewArenaGameApp(
		r.twApi,
		r.self.getParticipantsMap(),
		r.roomInfo.GameConfig,
		r.self,
		r.problemRepository,
		nil,
	)
	r.gameApp.Run()
	return err
}

func (r *ArenaRoomApp) OnFinishGame() {
	r.UserMadeRoomApp.OnFinishGame()

	r.self.Broadcast(serverMessage.NewNotifyMessage("10秒後に次ラウンドです"))
	time.AfterFunc(time.Second*10, func() {
		app.SendStartRequest(r.self, arenaConf)
	})
}
