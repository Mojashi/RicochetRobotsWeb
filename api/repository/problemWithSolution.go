package repository

import (
	"log"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/jmoiron/sqlx"
)

type IProblemWithSolutionRepository interface {
	GetUnused() (model.ProblemWithSolution, error)
	GetUnusedWithRange(solLenMin int, solLenMax int) (model.ProblemWithSolution, error)
	SetUsed(id int) error
	Get(id int) (model.ProblemWithSolution, error)
	Create(p model.ProblemWithSolution) error
}

type ProblemWithSolutionRepository struct {
	db *sqlx.DB
}

func NewProblemWithSolutionRepository(db *sqlx.DB) IProblemWithSolutionRepository {
	return &ProblemWithSolutionRepository{
		db: db,
	}
}

func (r ProblemWithSolutionRepository) Get(id int) (model.ProblemWithSolution, error) {
	p := model.ProblemWithSolution{}
	row := r.db.QueryRowx(
		"SELECT id, board, mainRobot, robotPoss, solution, numRobot from problems where id=?",
		id,
	)

	err := row.StructScan(&p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func (r ProblemWithSolutionRepository) GetUnused() (model.ProblemWithSolution, error) {

	var p model.ProblemWithSolution
	rows := r.db.QueryRowx(
		"SELECT id, board, mainRobot, robotPoss, solution, numRobot from problems where used=false LIMIT 1",
	)

	err := rows.StructScan(&p)
	if err != nil {
		log.Print(err.Error())
		return p, err
	}
	return p, nil
}

func (r ProblemWithSolutionRepository) GetUnusedWithRange(solLenMin int, solLenMax int) (model.ProblemWithSolution, error) {

	var p model.ProblemWithSolution
	rows := r.db.QueryRowx(
		"SELECT id, board, mainRobot, robotPoss, solution, numRobot from problems "+
			"where used=false and json_length(solution) between ? and ? LIMIT 1",
		solLenMin, solLenMax,
	)

	err := rows.StructScan(&p)
	if err != nil {
		log.Print(err.Error())
		return p, err
	}
	return p, nil
}

func (r ProblemWithSolutionRepository) SetUsed(id int) error {
	_, err := r.db.Exec(
		"UPDATE problems SET used=true where id=?",
		id,
	)
	return err
}

func (r ProblemWithSolutionRepository) Create(p model.ProblemWithSolution) error {
	_, err := r.db.Exec(
		"INSERT INTO problems(board, mainRobot, robotPoss, solution, numRobot) VALUES(?,?,?,?,?)",
		p.Board,
		p.MainRobot,
		p.RobotPoss,
		p.Solution,
		p.NumRobot,
	)
	return err
}
