package model

import (
	"database/sql/driver"
	"encoding/json"

	svg "github.com/ajstarks/svgo"
)

type Board struct {
	Height int      `json:"height"`
	Width  int      `json:"width"`
	Cells  [][]Cell `json:"cells"`
}

func (b Board) Move(poss []Pos, hand *Hand) bool {
	cur := poss[hand.Robot]
	if b.Cells[cur.Y][cur.X].Walls[hand.Dir] {
		return false
	}
	next := AddVec(hand.Dir, cur)
	next.Y = (next.Y + b.Height) % b.Height
	next.X = (next.X + b.Width) % b.Width

	for _, pos := range poss {
		if pos.X == next.X && pos.Y == next.Y {
			return false
		}
	}
	if b.Cells[next.Y][next.X].Mirror != nil && b.Cells[next.Y][next.X].Mirror.Trans != hand.Robot {
		m := *b.Cells[next.Y][next.X].Mirror
		hand.Dir = DoMirror(hand.Dir, m)
	}
	poss[hand.Robot] = next
	return true
}
func encodeRobot(pos Pos, dir Dir) uint32 {
	var ret uint32 = 0
	ret += uint32(pos.Y)
	ret += (uint32(pos.X) * 16)
	ret += (uint32(dir) * 256)
	return ret
}

//return if infinit loop
func (b Board) Slide(poss []Pos, hand Hand) bool {
	al := map[int32]bool{}
	al[int32(encodeRobot(poss[hand.Robot], hand.Dir))] = true
	for b.Move(poss, &hand) {
		if _, ok := al[int32(encodeRobot(poss[hand.Robot], hand.Dir))]; ok {
			return true
		}
		al[int32(encodeRobot(poss[hand.Robot], hand.Dir))] = true
	}
	return false
}

//return if infinite loop
func (b Board) Simulate(poss []Pos, hands Hands) bool {
	for _, hand := range hands {
		if b.Slide(poss, hand) {
			return true
		}
	}
	return false
}

func (b Board) Get(pos Pos) Cell {
	return b.Cells[pos.Y][pos.X]
}

func (b Board) Value() (driver.Value, error) {
	return json.Marshal(b)
}

func (b Board) Draw(canvas *svg.SVG, cellSize int) error {
	for i := 0; b.Height > i; i++ {
		for j := 0; b.Width > j; j++ {
			canvas.Image(j*cellSize, i*cellSize, cellSize, cellSize, "./img/cell.svg")
			if b.Cells[i][j].Goal {
				canvas.Image(j*cellSize, i*cellSize, cellSize, cellSize, "./img/goal.svg")
			}
			for k := 0; 4 > k; k++ {
				if b.Cells[i][j].Walls[k] {
					canvas.Image(j*cellSize, i*cellSize, cellSize, cellSize, "./img/wall.svg")
				}
			}
		}
	}
	return nil
}
