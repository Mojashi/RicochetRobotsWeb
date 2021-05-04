package model

import (
	"encoding/json"
	"fmt"
)

type Pos struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Poss []Pos

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
