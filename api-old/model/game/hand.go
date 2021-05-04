package game

//Dir 方向　上下左右
type Dir string

const (
	UP Dir = "up"
	RT Dir = "rt"
	DN Dir = "dn"
	LT Dir = "lt"
)

//Hand ロボットを動かす手
type Hand struct {
	Robot int `json:"robot"`
	Dir   Dir `json:"dir"`
}
