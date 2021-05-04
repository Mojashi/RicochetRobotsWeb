package serverMessage

type ServerMessage interface {
}

type Type = int

//iotaじゃないのはわざとです
const (
	AddHiddenSubmission Type = 0
	SetShortest         Type = 1
	FinishGame          Type = 2
	Start               Type = 3
	Join                Type = 4
	Leave               Type = 5
	UpdatePoint         Type = 6
	AddSubmission       Type = 7
	SetProblem          Type = 8
	StartTimelimit      Type = 9
	FinishProblem       Type = 10
	StartGame           Type = 11
)
