package repository

import (
	"log"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/jmoiron/sqlx"
)

type IUserRepository interface {
	Create(screenName string, twitterID string) (model.User, error)
	Delete(userID model.UserID) error
	Get(userID model.UserID) (model.User, error)
	GetByTwID(twitterID string) (model.User, error)
	Update(user model.User) error
	AddArenaWinCount(user model.UserID) error
	GetRanking(count int) []model.User
}

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) IUserRepository {
	return &UserRepository{db}
}

func (r UserRepository) Create(screenName, twitterID string) (model.User, error) {
	res, err := r.db.Exec(
		"INSERT INTO users(name, twitterID) VALUES(?,?)",
		screenName,
		twitterID,
	)
	if err != nil {
		return model.User{}, err
	}

	id, err := res.LastInsertId()

	return model.User{
		ID:        model.UserID(id),
		Name:      screenName,
		TwitterID: twitterID,
	}, err
}

func (r UserRepository) Get(userID model.UserID) (model.User, error) {
	u := model.User{}
	row := r.db.QueryRowx(
		"SELECT id, name, twitterID, arenaWinCount from users where id=?",
		userID,
	)

	err := row.StructScan(&u)
	return u, err
}
func (r UserRepository) GetByTwID(twitterID string) (model.User, error) {
	u := model.User{}
	row := r.db.QueryRowx(
		"SELECT id, name, twitterID, arenaWinCount from users where twitterID=?",
		twitterID,
	)

	err := row.StructScan(&u)
	return u, err
}

func (r UserRepository) Delete(userID model.UserID) error {
	return nil
}

func (r UserRepository) Update(user model.User) error {
	return nil
}

func (r UserRepository) AddArenaWinCount(userID model.UserID) error {
	_, err := r.db.Exec(
		"UPDATE users SET arenaWinCount=arenaWinCount+1 where id=?",
		userID,
	)
	return err
}

func (r UserRepository) GetRanking(count int) []model.User {
	rows, _ := r.db.Queryx(
		"SELECT id, name, twitterID, arenaWinCount from users order by arenaWinCount DESC limit ?",
		count,
	)
	ranking := []model.User{}
	for rows.Next() {
		u := model.User{}
		err := rows.StructScan(&u)
		if err != nil {
			log.Fatal(err)
		}
		ranking = append(ranking, u)
	}
	return ranking
}
