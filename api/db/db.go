package db

import (
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

const ProblemWithSolutionSchema = `
CREATE TABLE IF NOT EXISTS problems (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    randomValue float NOT NULL,
	board  longtext NOT NULL,
	mainRobot int NOT NULL,
	robotPoss longtext NOT NULL,
	solution longtext NOT NULL,
	numRobot int NOT NULL,
	torus boolean NOT NULL default false,
	mirror boolean NOT NULL default false,
	solutionLength int NOT NULL,
	numWall int NOT NULL,
	numMirror int NOT NULL,
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
	DBCon, err := sqlx.Connect("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s", DBUser, DBPass, DBHost, DBName))
	if err != nil {
		log.Fatalln(err)
	}

	r := DBCon.QueryRowx("select version()")
	dest := map[string]interface{}{}
	r.MapScan(dest)
	log.Println(string(dest["version()"].([]byte)))

	DBCon.MustExec(ProblemWithSolutionSchema)
	DBCon.MustExec(UserSchema)
	DBCon.MustExec(ArenaLogSchema)
	return DBCon
}
