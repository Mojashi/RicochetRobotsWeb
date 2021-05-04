package model

import (
	"database/sql/driver"
	"encoding/json"
)

type Board struct {
	Height int      `json:"height"`
	Width  int      `json:"width"`
	Cells  [][]Cell `json:"cells"`
}

func (b Board) Move(poss []Pos, hand Hand) bool {
	cur := poss[hand.Robot]
	if b.Cells[cur.Y][cur.X].Walls[hand.Dir] {
		return false
	}
	next := AddVec(hand.Dir, cur)
	for _, pos := range poss {
		if pos.X == next.X && pos.Y == next.Y {
			return false
		}
	}
	poss[hand.Robot] = next
	return true
}

func (b Board) Simulate(poss []Pos, hands Hands) {
	for _, hand := range hands {
		for b.Move(poss, hand) {
		}
	}
}

func (b Board) Get(pos Pos) Cell {
	return b.Cells[pos.Y][pos.X]
}

func (b Board) Value() (driver.Value, error) {
	return json.Marshal(b)
}
