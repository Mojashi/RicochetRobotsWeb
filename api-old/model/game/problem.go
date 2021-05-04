package game

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/Mojashi/RicochetRobotsWeb/api/db"
)

type Hands []Hand

//Problem 問題
type Problem struct {
	Board    Board `json:"board" db:"board"`
	OptHands Hands `json:"opthands" db:"opt_hands"`

	ID          int `json:"id" db:"id"`
	UsedInArena int `db:"used_arena"`
}

func (p *Board) Scan(val interface{}) error {
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

func (hs *Hands) Scan(val interface{}) error {
	switch v := val.(type) {
	case []byte:
		json.Unmarshal(v, &hs)
		return nil
	case string:
		json.Unmarshal([]byte(v), &hs)
		return nil
	default:
		return errors.New(fmt.Sprintf("Unsupported type: %T", v))
	}
}
func (p *Board) Value() (driver.Value, error) {
	return json.Marshal(p)
}
func (hs *Hands) Value() (driver.Value, error) {
	return json.Marshal(hs)
}

func FetchUnusedProblem() (Problem, error) {
	p := Problem{}

	row := db.DBCon.QueryRowx("SELECT * from problem where used_arena=0")
	err := row.StructScan(&p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func SetUsed(id int) error {
	_, err := db.DBCon.Exec("UPDATE problem SET used_arena=true WHERE id=?", id)
	return err
}
