package model

type Cell struct {
	Walls  [4]bool `json:"walls"`
	Mirror *Mirror `json:"mirror"`
	Goal   bool    `json:"goal"`
}

type Mirror struct {
	Trans int  `json:"trans"`
	Side  Side `json:"side"`
}

var md = []int{1, 0, 3, 2}
var nd = []int{3, 2, 1, 0}

func DoMirror(dir Dir, mirror Mirror) Dir {
	if mirror.Side == 0 {
		return nd[dir]
	} else {
		return md[dir]
	}
}

// 0=>\ 1=>/
type Side = int
