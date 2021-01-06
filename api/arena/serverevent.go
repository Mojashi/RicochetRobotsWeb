package arena

import (
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/game"
	"github.com/Mojashi/RicochetRobotsWeb/api/site"
)

type ServerEvent struct {
	//EventName string `json:"event_name"`

	Start  *StartSEvent  `json:"start,omitempty"`
	Submit *SubmitSEvent `json:"submit,omitempty"`
	Finish *FinishSEvent `json:"finish,omitempty"`
	Join   *JoinSEvent   `json:"join,omitempty"`
	Leave  *LeaveSEvent  `json:"leave,omitempty"`
}

type StartSEvent struct {
	GameID      int          `json:"game_id"`
	Game        game.Game    `json:"game"`
	Submissions []Submission `json:"subs"`
	FinishDate  time.Time    `json:"finishdate"`
}

type FinishSEvent struct {
	GameID     int        `json:"game_id"`
	Submission Submission `json:"sub"`
}

type SubmitSEvent struct {
	GameID     int        `json:"game_id"`
	Submission Submission `json:"sub"`
}

type JoinSEvent struct {
	User site.User `json:"user"`
}
type LeaveSEvent struct {
	User site.User `json:"user"`
}
