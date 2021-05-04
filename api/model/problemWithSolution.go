package model

type ProblemWithSolution struct {
	Solution Hands `json:"solution" db:"solution"`
	Problem
}
