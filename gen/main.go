package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/db"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
)

var DBCon *sqlx.DB

func dbInit() {
	DBName := os.Getenv("DB")
	DBUser := os.Getenv("DB_USER")
	DBPass := os.Getenv("DB_PASS")
	var err error
	DBCon, err = sqlx.Connect("mysql", fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/%s", DBUser, DBPass, DBName))
	if err != nil {
		log.Fatalln(err)
	}

	DBCon.MustExec(db.ProblemSchema)
}

func main() {
	err := godotenv.Load(fmt.Sprintf("../.env"))
	if err != nil {
		log.Fatal(".env doesnt exist")
	}
	dbInit()

	rand.Seed(time.Now().UnixNano())
	problem := rngProblem()

	jb, err := json.Marshal(problem.Board)
	if err != nil {
		log.Print(err.Error())
	}
	jo, err := json.Marshal(problem.OptHands)
	if err != nil {
		log.Print(err.Error())
	}

	_, err = DBCon.Exec("INSERT INTO problem (board,opt_hands) VALUES (?,?)", jb, jo)
	if err != nil {
		log.Print(err.Error())
	}

}
