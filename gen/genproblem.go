package main

import (
	"fmt"
	"log"
	"math/rand"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/game"
)

type board = game.Board
type color = game.Color
type pos = game.Pos
type hand = game.Hand

func setwall(board board, x int, y int, dir int) {
	vec := [][]int{{0, -1}, {1, 0}, {0, 1}, {-1, 0}}
	board.Cells[y][x].Walls[dir] = true

	nex := []int{x + vec[dir][0], y + vec[dir][1]}
	if nex[0] >= 0 && nex[1] >= 0 && nex[0] < 16 && nex[1] < 16 {
		board.Cells[nex[1]][nex[0]].Walls[(dir+2)%4] = true
	}
}

func rngBoard() board {
	mp := game.NewBoard(16, 16)
	// mp := [[[0 for k in range(4)] for i in range(16)] for j in range(16)]

	for i := 0; 16 > i; i++ {
		setwall(mp, 0, i, 3)
		setwall(mp, 15, i, 1)
		setwall(mp, i, 0, 0)
		setwall(mp, i, 15, 2)
	}

	setwall(mp, 7, 7, 1)
	setwall(mp, 7, 7, 2)
	setwall(mp, 7, 7, 0)
	setwall(mp, 7, 7, 3)
	setwall(mp, 8, 7, 0)
	setwall(mp, 8, 7, 1)
	setwall(mp, 8, 8, 1)
	setwall(mp, 8, 8, 2)
	setwall(mp, 8, 8, 0)
	setwall(mp, 8, 8, 3)
	setwall(mp, 7, 8, 2)
	setwall(mp, 7, 8, 3)

	elcount := rand.Intn(10) + 24

	for i := 0; elcount > i; i++ {
		x := rand.Intn(16)
		y := rand.Intn(16)
		d := rand.Intn(4)
		setwall(mp, x, y, d)
		setwall(mp, x, y, (d+1)%4)
	}

	return mp
}

func rngGame() game.Game {
	board := rngBoard()

	candnum := []int{}
	for i := 0; 16*16 > i; i++ {
		if i == 7*16+7 || i == 7*16+8 || i == 8*16+7 || i == 8*16+8 {
			continue
		}
		candnum = append(candnum, i)
	}

	cand := []pos{}
	for i := 0; 6 > i; i++ {
		p := rand.Intn(len(candnum))
		cand = append(cand, pos{Y: candnum[p] / 16, X: candnum[p] % 16})
		candnum = append(candnum[:p], candnum[p+1:]...)
	}

	goalpos := cand[5]
	robotposs := cand[:5]
	mainrobot := rand.Intn(5)
	board.Cells[goalpos.Y][goalpos.X].Goal = true
	return game.Game{
		Board:     board,
		RobotPoss: robotposs,
		MainRobot: mainrobot,
	}
}

func stringify(g game.Game) string {
	instr := ""
	b := g.Board
	var goalpos pos

	for i := 0; 16 > i; i++ {
		for j := 0; 16 > j; j++ {
			cell := b.Get(pos{Y: i, X: j})
			if cell.Walls[1] {
				instr += fmt.Sprintf("%d %d 1\n", i, j)
			}
			if cell.Walls[2] {
				instr += fmt.Sprintf("%d %d 2\n", i, j)
			}
			if cell.Goal {
				goalpos = pos{Y: i, X: j}
			}
		}
	}

	instr += "-1 -1 -1\n"

	robotposs := g.RobotPoss

	for i := 0; 5 > i; i++ {
		instr += fmt.Sprintf("%d %d\n", robotposs[i].Y, robotposs[i].X)
	}
	instr += fmt.Sprintf("%d\n", g.MainRobot)

	instr += fmt.Sprintf("%d %d\n", goalpos.Y, goalpos.X)

	return instr
}

func parseHands(g game.Game, str string) ([]hand, error) {
	poss := make([]pos, len(g.RobotPoss))
	copy(poss, g.RobotPoss)
	strs := strings.Split(str, "\n")
	hands := []hand{}

	for _, hs := range strs[1:] {
		as := strings.Split(hs, " ")
		if len(as) != 3 {
			continue
		}
		robot, _ := strconv.Atoi(as[0])
		y, _ := strconv.Atoi(as[1])
		x, _ := strconv.Atoi(as[2])
		nex := pos{Y: y, X: x}
		var dir game.Dir

		if y > poss[robot].Y {
			dir = game.DN
		} else if y < poss[robot].Y {
			dir = game.UP
		} else if x > poss[robot].X {
			dir = game.RT
		} else if x < poss[robot].X {
			dir = game.LT
		} else {
			return []hand{}, fmt.Errorf("couldnt parse direction")
		}
		hands = append(hands, hand{Robot: robot, Dir: dir})

		poss[robot] = nex
	}

	if !g.Board.Get(poss[g.MainRobot]).Goal {
		return []hand{}, fmt.Errorf("invalid solution(couldnt reach goal)")
	}

	if !game.CheckSolution(g, hands) {
		log.Fatal("ERROROROOROR")
	}
	return hands, nil
}

func rngProblem() game.Problem {
	for {

		g := rngGame()
		log.Println(g)

		cmd := exec.Command("./solver")
		in, _ := cmd.StdinPipe()

		in.Write([]byte(stringify(g)))
		in.Close()
		out := []byte{}
		fin := make(chan bool, 1)
		go func() {
			out, _ = cmd.Output()
			fin <- true
		}()

		hands := []hand{}
		select {
		case <-fin:
			var err error
			hands, err = parseHands(g, string(out))
			if err == nil {
				log.Println(hands)
				return game.Problem{
					Game:     g,
					OptHands: hands,
				}
			}
			log.Fatalf(err.Error())

		case <-time.After(30 * time.Second):
			cmd.Process.Kill()
		}
	}
}
