package model

type Dir = int

const UP Dir = 0
const RT Dir = 1
const DN Dir = 2
const LT Dir = 3

func AddVec(d Dir, pos Pos) Pos {
	vec := [4]Pos{Pos{X: 0, Y: -1}, Pos{X: 1, Y: 0}, Pos{X: 0, Y: 1}, Pos{X: -1, Y: 0}}
	return Pos{X: pos.X + vec[d].X, Y: pos.Y + vec[d].Y}
}

func InvDir(d Dir) Dir {
	return (d + 2) % 4
}
