package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"math/rand"
	"strings"
)

type Hands []Hand

var nums = []byte{'1', '2', '3', '4', '5', '6', '7', '8'}
var dirs = []byte{'u', 'r', 'd', 'l'}

func (b Hands) Value() (driver.Value, error) {
	return json.Marshal(b)
}

func find(ch byte, ar []byte) int {
	for i := 0; len(ar) > i; i++ {
		if ar[i] == ch {
			return i
		}
	}
	return -1
}

func StrToHands(str string) (Hands, error) {
	str = strings.TrimSpace(str)
	if len(str)%2 == 1 {
		return Hands{}, nil
	}
	hs := Hands{}
	for i := 0; len(str) > i; i += 2 {
		num := find(str[i], nums)
		dir := find(str[i+1], dirs)
		if num == -1 || dir == -1 {
			return Hands{}, nil
		}

		hs = append(hs, Hand{Dir: dir, Robot: num})
	}
	return hs, nil
}

func (pc *Hands) Scan(val interface{}) error {
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

type SolutionHash = uint32

const maxH = 20
const maxW = 20
const maxR = 10

var zobTable [maxH][maxW][maxH][maxW][maxR]uint32

func init() {
	for i := 0; maxH > i; i++ {
		for j := 0; maxW > j; j++ {
			for k := 0; maxH > k; k++ {
				for l := 0; maxW > l; l++ {
					for m := 0; maxR > m; m++ {
						zobTable[i][j][k][l][m] = rand.Uint32()
					}
				}
			}
		}
	}
}

func (hs Hands) Hash(p Problem) SolutionHash {
	var hash SolutionHash
	poss := make(Poss, len(p.RobotPoss))
	copy(poss, p.RobotPoss)

	for _, hand := range hs {
		bef := poss[hand.Robot]
		for p.Board.Move(poss, hand) {
		}
		nex := poss[hand.Robot]
		hash ^= zobTable[bef.Y][bef.X][nex.X][nex.Y][hand.Robot]
	}
	return hash
}
