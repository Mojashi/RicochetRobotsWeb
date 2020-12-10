package game

type Pos struct {
	X int `json:"x"`
	Y int `json:"y"`
}

//ボードとプレイヤースタート位置のセット
type Game struct {
	Board     Board `json:"board"`
	RobotPoss []Pos `json:"poss"`
}
