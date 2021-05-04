package db

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
)

const ProblemSchema = `
CREATE TABLE IF NOT EXISTS problem (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	board  json NOT NULL,
	opt_hands json NOT NULL,
	used_arena	int DEFAULT 0
);
`
const UserSchema = `
CREATE TABLE IF NOT EXISTS user (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name char(20) not null,
	password char(20) not null,
	win_count int not null default 0,
	twitter_id char(30) default null unique
);
`

var DBCon *sqlx.DB

func DbInit() {
	DBName := os.Getenv("DB")
	DBUser := os.Getenv("DB_USER")
	DBPass := os.Getenv("DB_PASS")
	var err error
	DBCon, err = sqlx.Connect("mysql", fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/%s", DBUser, DBPass, DBName))
	if err != nil {
		log.Fatalln(err)
	}

	DBCon.MustExec(ProblemSchema)
	DBCon.MustExec(UserSchema)
}
