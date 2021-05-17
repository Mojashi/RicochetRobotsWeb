package repository

import (
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/jmoiron/sqlx"
)

type IArenaLogRepository interface {
	Create(gameID int, userID model.UserID) error
	GetLatestGameID() int
	GetWinCount(userID model.UserID) int
}

type ArenaLogRepository struct {
	db *sqlx.DB
}

func NewAreanLogRepository(db *sqlx.DB) IArenaLogRepository {
	return &ArenaLogRepository{db}
}
func (r *ArenaLogRepository) Create(gameID int, userID model.UserID) error {
	_, err := r.db.Exec(
		"INSERT INTO arenaLog(gameID, userID, createdAt) VALUES(?,?,now())",
		gameID,
		userID,
	)
	return err
}
func (r *ArenaLogRepository) GetLatestGameID() int {
	var u int
	row := r.db.QueryRowx(
		"SELECT max(gameID) from arenaLog",
	)

	err := row.Scan(&u)
	if err != nil {
		return 0
	}
	return u
}

func (r *ArenaLogRepository) GetWinCount(userID model.UserID) int {
	var u int
	row := r.db.QueryRowx(
		"SELECT count(1) from arenaLog where userID=?",
		userID,
	)

	err := row.Scan(&u)
	if err != nil {
		return 0
	}
	return u
}
