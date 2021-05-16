package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type Pos struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Poss []Pos

func (b Poss) Value() (driver.Value, error) {
	return json.Marshal(b)
}

func (pc *Poss) Scan(val interface{}) error {
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
