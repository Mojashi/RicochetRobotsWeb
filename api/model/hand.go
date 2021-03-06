package model

import (
	"encoding/json"
	"fmt"
)

type Hand struct {
	Robot Robot `json:"robot"`
	Dir   Dir   `json:"dir"`
}

func (pc *Hand) Scan(val interface{}) error {
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
