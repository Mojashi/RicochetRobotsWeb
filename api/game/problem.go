package game

//Problem 問題
type Problem struct {
	Game     Game   `json:"game"`
	OptHands []Hand `json:"opthands"`
}
