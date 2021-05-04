package game

import (
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/site"
)

type Submission struct {
	ID      int       `json:"id"`
	User    site.User `json:"user"`
	Hands   []Hand    `json:"hands"`
	Date    time.Time `json:"date"`
	Optimal bool      `json:"opt"`
}
