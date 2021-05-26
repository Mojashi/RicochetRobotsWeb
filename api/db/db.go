package db

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
)

const ProblemWithSolutionSchema = `
CREATE TABLE IF NOT EXISTS problems (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    randomValue float NOT NULL,
	board  json NOT NULL,
	mainRobot int NOT NULL,
	robotPoss json NOT NULL,
	solution json NOT NULL,
	numRobot int NOT NULL,
	torus boolean NOT NULL default false,
	mirror boolean NOT NULL default false,
	used	boolean DEFAULT false
);
`
const UserSchema = `
CREATE TABLE IF NOT EXISTS users (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name char(20) not null,
	password char(20),
	twitterID char(30) default null unique,
	arenaWinCount int not null default 0
);
`
const ArenaLogSchema = `
CREATE TABLE IF NOT EXISTS arenaLog (
	gameID int NOT NULL PRIMARY KEY,
	userID int NOT NULL,
	createdAt datetime NOT NULL
);
`

func NewDB(DBHost, DBName, DBUser, DBPass string) *sqlx.DB {
	DBCon, err := sqlx.Connect("mariadb", fmt.Sprintf("%s:%s@tcp(%s)/%s", DBUser, DBPass, DBHost, DBName))
	if err != nil {
		log.Fatalln(err)
	}

	DBCon.MustExec(ProblemWithSolutionSchema)
	DBCon.MustExec(UserSchema)
	DBCon.MustExec(ArenaLogSchema)
	return DBCon
}
