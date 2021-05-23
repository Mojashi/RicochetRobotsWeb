package model

type GameConfig struct {
	Rule          Rule          `json:"rule"`
	Timelimit     int           `json:"timeLimit"`
	GoalPoint     int           `json:"goalPoint"`
	PointForFirst int           `json:"pointForFirst"`
	PointForOther int           `json:"pointForOther"`
	ProblemConfig ProblemConfig `json:"problemConfig"`
}

type ProblemConfig struct {
	SolLenMin int `json:"solLenMin"`
	SolLenMax int `json:"solLenMax"`

	Torus  Needs `json:"torus"`
	Mirror Needs `json:"mirror"`
}

type Needs = int

const Never Needs = 0
const Optional Needs = 1
const Required Needs = 2
