package gen

import (
	"errors"
	"fmt"
	"log"
	"math/rand"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/Mojashi/RicochetRobots/api/model"
)

func NewBoard(height, width int) model.Board {
	cells := make([][]model.Cell, height)
	for i := 0; height > i; i++ {
		cells[i] = make([]model.Cell, width)
	}

	return model.Board{
		Height: height,
		Width:  width,
		Cells:  cells,
	}
}

func SetWall(b model.Board, y, x int, d model.Dir) {
	b.Cells[y][x].Walls[d] = true
	nex := model.AddVec(d, model.Pos{X: x, Y: y})

	if nex.X < b.Width && nex.X >= 0 && nex.Y < b.Height && nex.Y >= 0 {
		b.Cells[nex.Y][nex.X].Walls[model.InvDir(d)] = true
	}
}

func rngBoard() model.Board {
	mp := NewBoard(16, 16)
	// mp := [[[0 for k in range(4)] for i in range(16)] for j in range(16)]

	for i := 0; 16 > i; i++ {
		SetWall(mp, 0, i, model.UP)
		SetWall(mp, 15, i, model.DN)
		SetWall(mp, i, 0, model.LT)
		SetWall(mp, i, 15, model.RT)
	}

	SetWall(mp, 7, 7, model.UP)
	SetWall(mp, 7, 7, model.LT)
	SetWall(mp, 8, 7, model.DN)
	SetWall(mp, 8, 7, model.LT)
	SetWall(mp, 8, 8, model.DN)
	SetWall(mp, 8, 8, model.RT)
	SetWall(mp, 7, 8, model.UP)
	SetWall(mp, 7, 8, model.RT)

	elcount := rand.Intn(10) + 24

	for i := 0; elcount > i; i++ {
		x := rand.Intn(16)
		y := rand.Intn(16)
		d := rand.Intn(4)
		SetWall(mp, y, x, d)
		SetWall(mp, y, x, (d+1)%4)
	}

	return mp
}

func rngProblem() model.Problem {
	board := rngBoard()

	candnum := []int{}
	for i := 0; 16*16 > i; i++ {
		if i == 7*16+7 || i == 7*16+8 || i == 8*16+7 || i == 8*16+8 {
			continue
		}
		candnum = append(candnum, i)
	}

	cand := []model.Pos{}
	for i := 0; 6 > i; i++ {
		p := rand.Intn(len(candnum))
		cand = append(cand, model.Pos{Y: candnum[p] / 16, X: candnum[p] % 16})
		candnum = append(candnum[:p], candnum[p+1:]...)
	}

	goalpos := cand[5]
	board.Cells[goalpos.Y][goalpos.X].Goal = true
	return model.Problem{
		RobotPoss: cand[:5],
		MainRobot: rand.Intn(5),
		Board:     board,
		NumRobot:  5,
	}
}

func stringify(p model.Problem) string {
	instr := ""
	var goalpos model.Pos
	b := p.Board

	for i := 0; 16 > i; i++ {
		for j := 0; 16 > j; j++ {
			cell := b.Get(model.Pos{Y: i, X: j})
			if cell.Walls[1] {
				instr += fmt.Sprintf("%d %d 1\n", i, j)
			}
			if cell.Walls[2] {
				instr += fmt.Sprintf("%d %d 2\n", i, j)
			}
			if cell.Goal {
				goalpos = model.Pos{Y: i, X: j}
			}
		}
	}

	log.Println(instr)

	instr += "-1 -1 -1\n"

	for i := 0; 5 > i; i++ {
		instr += fmt.Sprintf("%d %d\n", p.RobotPoss[i].Y, p.RobotPoss[i].X)
	}
	instr += fmt.Sprintf("%d\n", p.MainRobot)

	instr += fmt.Sprintf("%d %d\n", goalpos.Y, goalpos.X)

	return instr
}

func parseHands(p model.Problem, str string) (model.Hands, error) {
	log.Println(str)
	poss := make([]model.Pos, len(p.RobotPoss))
	copy(poss, p.RobotPoss)
	strs := strings.Split(str, "\n")
	hands := model.Hands{}

	for _, hs := range strs[1:] {
		as := strings.Split(hs, " ")
		if len(as) != 3 {
			continue
		}
		robot, _ := strconv.Atoi(as[0])
		y, _ := strconv.Atoi(as[1])
		x, _ := strconv.Atoi(as[2])
		nex := model.Pos{Y: y, X: x}
		var dir model.Dir

		if y > poss[robot].Y {
			dir = model.DN
		} else if y < poss[robot].Y {
			dir = model.UP
		} else if x > poss[robot].X {
			dir = model.RT
		} else if x < poss[robot].X {
			dir = model.LT
		} else {
			return model.Hands{}, fmt.Errorf("couldnt parse direction")
		}
		hands = append(hands, model.Hand{Robot: robot, Dir: dir})

		poss[robot] = nex
	}

	if !p.Board.Get(poss[p.MainRobot]).Goal {
		return []model.Hand{}, errors.New("invalid solution(couldnt reach goal)")
	}

	if !p.IsValid(hands) {
		return nil, errors.New("solver has some bugs")
	}
	return hands, nil
}

func rngProblemWithSolution(timeout int) model.ProblemWithSolution {
	for {
		p := rngProblem()

		cmd := exec.Command("./gen/solver")
		in, _ := cmd.StdinPipe()

		in.Write([]byte(stringify(p)))
		in.Close()
		out := []byte{}
		fin := make(chan bool, 1)
		go func() {
			out, _ = cmd.Output()
			fin <- true
		}()

		select {
		case <-fin:
			hands, err := parseHands(p, string(out))
			if err == nil {
				return model.ProblemWithSolution{
					Solution: hands,
					Problem:  p,
				}
			}
			log.Fatalf(err.Error())

		case <-time.After(time.Duration(timeout) * time.Second):
			cmd.Process.Kill()
		}
	}
}
