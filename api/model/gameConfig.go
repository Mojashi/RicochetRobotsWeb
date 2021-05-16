package model

type GameConfig struct {
	Rule          Rule `json:"rule"`
	Timelimit     int  `json:"timeLimit"`
	GoalPoint     int  `json:"goalPoint"`
	PointForFirst int  `json:"pointForFirst"`
	PointForOther int  `json:"pointForOther"`

	SolLenMin int `json:"solLenMin"`
	SolLenMax int `json:"solLenMax"`
}
