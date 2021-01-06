package game

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"
)

//Problem 問題
type Problem struct {
	Game     Game   `json:"game"`
	OptHands []Hand `json:"opthands"`
}

func NewProblem() Problem {
	return Problem{
		OptHands: []Hand{},
		Game:     NewGame(),
	}
}

func (p *Problem) Scan(val interface{}) error {
	switch v := val.(type) {
	case []byte:
		json.Unmarshal(v, &p)
		return nil
	case string:
		json.Unmarshal([]byte(v), &p)
		return nil
	default:
		return errors.New(fmt.Sprintf("Unsupported type: %T", v))
	}
}
func (p *Problem) Value() (driver.Value, error) {
	return json.Marshal(p)
}

type ProblemRecord struct {
	Id          int     `db:"id"`
	Problem     Problem `db:"problem"`
	UsedInArena int     `db:"used_arena"`
}

const ProblemSchema = `
CREATE TABLE IF NOT EXISTS problem (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    problem  json NOT NULL,
	used_arena	int DEFAULT 0
);
`

func FetchUnusedProblem(db *sqlx.DB) (int, Problem, error) {
	p := ProblemRecord{}

	row := db.QueryRowx("SELECT * from problem where used_arena=0 and JSON_LENGTH(problem->\"$.opthands\")<=4")
	err := row.StructScan(&p)
	if err != nil {
		return 0, p.Problem, err
	}
	return p.Id, p.Problem, nil
}

func SetUsed(db *sqlx.DB, id int) error {
	_, err := db.Exec("UPDATE problem SET used_arena=true WHERE id=?", id)
	return err
}
