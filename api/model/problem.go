package model

import (
	"encoding/json"
	"fmt"
)

type Problem struct {
	ID        int   `json:"id" db:"id"`
	Board     Board `json:"board" db:"board"`
	MainRobot Robot `json:"mainRobot" db:"mainRobot"`
	RobotPoss Poss  `json:"robotPoss" db:"robotPoss"`
	NumRobot  int   `json:"numRobot" db:"numRobot"`
	Torus     bool  `json:"torus" db:"torus"`
	Mirror    bool  `json:"mirror" db:"mirror"`
}

func (p Problem) IsValid(hands Hands) bool {
	for _, hand := range hands {
		if hand.Robot >= p.NumRobot {
			return false
		}
	}

	cposs := make([]Pos, len(p.RobotPoss))
	copy(cposs, p.RobotPoss)
	p.Board.Simulate(cposs, hands)
	mpos := cposs[p.MainRobot]
	return p.Board.Cells[mpos.Y][mpos.X].Goal
}

func (pc *Board) Scan(val interface{}) error {
	switch v := val.(type) {
	case []byte:
		json.Unmarshal(v, &pc)
		return nil
	case string:
		json.Unmarshal([]byte(v), &pc)
		return nil
	default:
		return fmt.Errorf("unsupported type: %T", v)
	}
}

func (p *Problem) Draw(path string) error {
	// cellSize := 64
	// width := p.Width * cellSize
	// height := b.Height * cellSize
	return nil
}
