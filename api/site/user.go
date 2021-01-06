package site

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type User struct {
	ID       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	PassWord string `json:"password" db:"password"`

	WinCount  int    `json:"win_count" db:"win_count"`
	TwitterID string `json:"twitter_id" db:"twitter_id"`
}

const UserSchema = `
CREATE TABLE IF NOT EXISTS user (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name char(20) not null,
	password char(20) not null,
	win_count int not null default 0,
	twitter_id char(30) default null unique
);
`

func FetchUserByID(db *sqlx.DB, id int) (user User, err error) {
	row := db.QueryRowx("SELECT * from user where id=?", id)
	err = row.StructScan(&user)
	if err != nil {
		return User{}, err
	}
	return user, nil
}

func CreateUser(db *sqlx.DB, name string, twitterID string) (User, error) {
	if _, err := db.Exec("INSERT IGNORE INTO user (name, password, twitter_id) values (?,?,?)", name, RandStringRunes(15), twitterID); err != nil {
		return User{}, err
	}
	return FetchUserByTwitterID(db, twitterID)
}

func FetchUserByTwitterID(db *sqlx.DB, twitter_id string) (user User, err error) {

	row := db.QueryRowx("SELECT * from user where twitter_id=?", twitter_id)
	err = row.StructScan(&user)
	if err != nil {
		return User{}, err
	}
	return user, nil
}

func FetchMeHandler(c echo.Context) error {
	if c.Get("authorized") == false {
		return echo.ErrUnauthorized
	}
	user := c.Get("user").(User)
	return c.JSON(http.StatusOK, user)
}

// func FetchUserAPI(c echo.Context) {
// 	user =
// 	return c.JSON(http.StatusOK, user)
// }
