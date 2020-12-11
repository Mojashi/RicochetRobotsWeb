package game

//Problem 問題
type Problem struct {
	Game     Game   `json:"game"`
	OptHands []Hand `json:"opthands"`
}

func NewProblem() Problem {
	return Problem{
		OptHands: []Hand{},
		Game:     NewGame(),
	}
}
