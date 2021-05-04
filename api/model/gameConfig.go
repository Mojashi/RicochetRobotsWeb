package model

type GameConfig struct {
	Rule      Rule `json:"rule"`
	Interval  int  `json:"interval"`
	Timelimit int  `json:"timelimit"`
}
