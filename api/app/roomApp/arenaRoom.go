package roomApp

import (
	"fmt"
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
	self               IArenaRoomApp
	userRepository     repository.IUserRepository
	arenaLogRepository repository.IArenaLogRepository
	twApi              twitter.TwitterAPI
	nextStartTime      time.Time
}

var arenaConf = model.GameConfig{
	Rule:          model.FirstToWin,
	Timelimit:     20,
	GoalPoint:     30,
	PointForFirst: 5,
	PointForOther: 3,
	SolLenMin:     6,
	SolLenMax:     99,
}

func NewArenaRoomApp(
	room model.RoomInfo,
	roomManager app.IRoomObserver,
	userRepository repository.IUserRepository,
	problemRepository repository.IProblemWithSolutionRepository,
	arenaLogRepository repository.IArenaLogRepository,
	twApi twitter.TwitterAPI,
	self IArenaRoomApp,
) *ArenaRoomApp {
	roomApp := &ArenaRoomApp{
		twApi:              twApi,
		userRepository:     userRepository,
		arenaLogRepository: arenaLogRepository,
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
	r.self.Broadcast(serverMessage.NewNotifyMessage("ラウンド"+strconv.Itoa(r.arenaLogRepository.GetLatestGameID()+1), -1))
	r.self.SetOnGame(true)

	var err error
	r.gameApp = gameApp.NewArenaGameApp(
		r.twApi,
		r.userRepository,
		r.arenaLogRepository,
		r.self.getParticipantsMap(),
		r.roomInfo.GameConfig,
		r.self,
		r.problemRepository,
		nil,
	)
	r.gameApp.Run()
	return err
}

func (r *ArenaRoomApp) GetSyncRoomMessage() serverMessage.ServerMessage {
	ret := r.UserMadeRoomApp.GetSyncRoomMessage()
	if !r.roomInfo.OnGame {
		if ar, ok := ret.(serverMessage.SyncRoomMessage); ok {
			ar = append(ar, serverMessage.NewNotifyMessage(
				fmt.Sprint(int(-time.Since(r.nextStartTime).Seconds()))+"秒後に次ラウンドです", 10),
			)
			return ar
		}
	}
	return ret
}

func (r *ArenaRoomApp) OnFinishGame() {
	r.UserMadeRoomApp.OnFinishGame()

	time.AfterFunc(time.Second*10, func() {
		r.self.Broadcast(serverMessage.NewNotifyMessage("5分後に次ラウンドです", 20))
	})

	intervalLen := time.Second * time.Duration(300)

	r.nextStartTime = time.Now().Add(intervalLen)
	time.AfterFunc(intervalLen, func() {
		app.SendStartRequest(r.self, arenaConf)
	})
}
