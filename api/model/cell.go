package model

type Cell struct {
	Walls [4]bool `json:"walls"`
	Goal  bool    `json:"goal"`
}
