package model

type ProblemState struct {
	Problem     ProblemWithSolution
	Timelimit   bool
	Shortest    *Submission
	Submissions []Submission
}

func NewProblemState(problem ProblemWithSolution) ProblemState {
	return ProblemState{
		Problem:     problem,
		Timelimit:   false,
		Shortest:    nil,
		Submissions: []Submission{},
	}
}
