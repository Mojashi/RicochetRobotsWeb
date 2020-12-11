package game

//MIRROR 鏡の種類
type MIRROR string

const (
	//RMIRROR /みたいな鏡
	RMIRROR MIRROR = "/"
	//LMIRROR \みたいな鏡
	LMIRROR MIRROR = "\\"
)

//Cell マス目
type Cell struct {
	Walls  [4]bool `json:"walls"`
	Mirror *MIRROR `json:"mirror,omitempty"`
	// Mark   int     `json:"mark,omitempty"`
	Goal bool `json:"goal"`
}

//Board ぼーどぜんたい
type Board struct {
	Height int      `json:"height"`
	Width  int      `json:"width"`
	Cells  [][]Cell `json:"cells"`
}

//NewBoard 空のボードを作る
func NewBoard(width int, height int) Board {
	cells := make([][]Cell, height)
	for i := 0; i < height; i++ {
		cells[i] = make([]Cell, width)
		for j := 0; j > width; j++ {
			cells[i][j] = Cell{Walls: [4]bool{false, false, false, false}, Mirror: nil, Goal: false}
		}
	}
	return Board{Height: height, Width: width, Cells: cells}
}

func (b *Board) get(pos Pos) Cell {
	return b.Cells[pos.Y][pos.X]
}
