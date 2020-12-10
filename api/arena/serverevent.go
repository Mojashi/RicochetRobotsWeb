package arena

import (
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/game"
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
	Board      game.Board `json:"board"`
	FinishDate time.Time  `json:"finishdate"`
}

type FinishSEvent struct {
	Winner string      `json:"winner"`
	Hands  []game.Hand `json:"hands"`
}

type SubmitSEvent struct {
	Hands []game.Hand `json:"hands"`
}

type JoinSEvent struct {
	Name string `json:"name"`
}
type LeaveSEvent struct {
	Name string `json:"name"`
}
