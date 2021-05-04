package game

import (
	"github.com/Mojashi/RicochetRobotsWeb/api/site"
)

type ServerEvent interface {
	stringify()
}

type ShowSubmissionSEvent struct {
	Submission Submission `json:"sub"`
}

type StartSEvent struct {
	Game        Game         `json:"game"`
	Submissions []Submission `json:"subs"`
}

// type SEvent struct {
// 	GameID     int        `json:"game_id"`
// 	Submission Submission `json:"sub"`
// }

type TimeLimitSEvent struct {
	GameID  int `json:"game_id"`
	RemTime int `json:"rem_time"`
}
type FinishSEvent struct {
	GameID   int  `json:"game_id"`
	Interval *int `json:"interval"`
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
