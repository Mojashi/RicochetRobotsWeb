package game

import (
	"encoding/json"
	"log"
)

type Pos struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func SendEvent(c chan<- []byte, event ServerEvent) error {
	var msg []byte
	var err error
	msg, err = json.Marshal(event)

	if msg, err = json.Marshal(event); err != nil {
		log.Print(err)
		return err
	}
	c <- msg
	return nil
}

func dirIdx(dir Dir) int {
	switch dir {
	case UP:
		return 0
	case RT:
		return 1
	case DN:
		return 2
	case LT:
		return 3
	}
	return 0
}

func minInt(x int, y int) int {
	if x > y {
		return y
	}
	return x
}

func dirVec(dir Dir) Pos {
	switch dir {
	case UP:
		return Pos{X: 0, Y: -1}
	case RT:
		return Pos{X: 1, Y: 0}
	case DN:
		return Pos{X: 0, Y: 1}
	case LT:
		return Pos{X: -1, Y: 0}
	}

	// log.Fatal("invalid dir " + dir)
	return Pos{X: 0, Y: -1}
}

func addPos(p Pos, v Pos) Pos {
	return Pos{X: v.X + p.X, Y: v.Y + p.Y}
}

func canGo(board Board, poss []Pos, robot int, dir Dir) bool {
	nex := addPos(poss[robot], dirVec(dir))
	if nex.X >= board.Width || nex.Y >= board.Height || nex.X < 0 || nex.Y < 0 {
		return false
	}
	for _, pos := range poss {
		if pos == nex {
			return false
		}
	}
	return !board.Cells[poss[robot].Y][poss[robot].X].Walls[dirIdx(dir)]
}

//CheckSolution 解の正しさチェック
func CheckSolution(board Board, hands []Hand) bool {
	curPos := make([]Pos, len(board.RobotPoss))
	copy(curPos, board.RobotPoss)

	for _, hand := range hands {
		vec := dirVec(hand.Dir)
		nex := addPos(curPos[hand.Robot], vec)
		for canGo(board, curPos, hand.Robot, hand.Dir) {
			curPos[hand.Robot] = nex
			nex = addPos(curPos[hand.Robot], vec)
		}
	}

	return board.Get(curPos[board.MainRobot]).Goal
}
