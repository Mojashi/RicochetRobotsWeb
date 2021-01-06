package game

type Pos struct {
	X int `json:"x"`
	Y int `json:"y"`
}

//ボードとプレイヤースタート位置のセット
type Game struct {
	Board     Board `json:"board"`
	MainRobot int   `json:"main_robot"`
	RobotPoss []Pos `json:"poss"`
}

//NewGame 適当な盤面を生成
func NewGame() Game {
	return Game{
		Board:     NewBoard(10, 10),
		MainRobot: 0,
		RobotPoss: []Pos{{X: 1, Y: 1}, {X: 2, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}, {X: 4, Y: 4}},
	}
}
