package repository

import (
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/jmoiron/sqlx"
)

type IUserRepository interface {
	Create(screenName string, twitterID string) (model.User, error)
	Delete(userID model.UserID) error
	Get(userID model.UserID) (model.User, error)
	GetByTwID(twitterID string) (model.User, error)
	Update(user model.User) error
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
		"SELECT id, name, twitterID from users where id=?",
		userID,
	)

	err := row.StructScan(&u)
	return u, err
}
func (r UserRepository) GetByTwID(twitterID string) (model.User, error) {
	u := model.User{}
	row := r.db.QueryRowx(
		"SELECT id, name, twitterID from users where twitterID=?",
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
