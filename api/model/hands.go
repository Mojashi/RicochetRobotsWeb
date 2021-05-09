package model

import (
	"encoding/json"
	"fmt"
	"math/rand"
)

type Hands []Hand

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
