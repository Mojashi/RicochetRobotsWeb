package repository

import (
	"log"
	"math/rand"
	"strings"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/jmoiron/sqlx"
)

type IProblemWithSolutionRepository interface {
	GetUnused() (model.ProblemWithSolution, error)
	GetUnusedWithConfig(conf model.ProblemConfig, allowUsed bool) (model.ProblemWithSolution, error)
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
		"SELECT id, board, mainRobot, robotPoss, solution, numRobot, torus, mirror from problems where id=?",
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
		"SELECT id, board, mainRobot, robotPoss, solution, numRobot, torus, mirror from problems where used=false ORDER BY randomValue LIMIT 1",
	)

	err := rows.StructScan(&p)
	if err != nil {
		log.Print(err.Error())
		return p, err
	}
	return p, nil
}

func (r ProblemWithSolutionRepository) GetUnusedWithConfig(conf model.ProblemConfig, allowUsed bool) (model.ProblemWithSolution, error) {
	var p model.ProblemWithSolution

	whereArgs := []interface{}{}
	wheres := []string{"true"}

	if !allowUsed {
		wheres = append(wheres, "used=false")
	}

	wheres = append(wheres, "solutionLength between ? and ?")
	whereArgs = append(whereArgs, conf.SolLenMin, conf.SolLenMax)

	if conf.Torus != model.Optional || rand.Intn(3) == 0 {
		wheres = append(wheres, "torus=?")
		whereArgs = append(whereArgs, conf.Torus == model.Required)
	}
	if conf.Mirror != model.Optional || rand.Intn(3) == 0 {
		wheres = append(wheres, "mirror=?")
		whereArgs = append(whereArgs, conf.Mirror == model.Required)
	}

	rows := r.db.QueryRowx(
		"SELECT id, board, mainRobot, robotPoss, solution, numRobot, torus, mirror from problems where "+
			strings.Join(wheres, " and ")+" ORDER BY randomValue LIMIT 1",
		whereArgs...,
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
	numWall, numMirror := p.Board.CountWallMirror()

	_, err := r.db.Exec(
		"INSERT INTO problems(board, mainRobot, robotPoss, solution, solutionLength, numWall,numMirror, numRobot, torus, mirror, randomValue) VALUES(?,?,?,?,?,?,?,?,?,?,RAND())",
		p.Board,
		p.MainRobot,
		p.RobotPoss,
		p.Solution,
		len(p.Solution),
		numWall,
		numMirror,
		p.NumRobot,
		p.Torus,
		p.Mirror,
	)
	return err
}
