package model

type TimeStamp int64

type Submission struct {
	ID        int       `json:"id"`
	User      User      `json:"user"`
	Hands     Hands     `json:"hands"`
	Length    int       `json:"length"`
	TimeStamp TimeStamp `json:"timeStamp"`
	Optimal   bool      `json:"optimal"`
}

type ResultSubmission struct {
	Submission
	SolHash    SolutionHash `json:"solHash"`
	AddedPoint int          `json:"addedPoint"`
}
