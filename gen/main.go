package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/game"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
)

var db *sqlx.DB

func dbInit() {
	DBName := os.Getenv("DB")
	DBUser := os.Getenv("DB_USER")
	DBPass := os.Getenv("DB_PASS")
	var err error
	db, err = sqlx.Connect("mysql", fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/%s", DBUser, DBPass, DBName))
	if err != nil {
		log.Fatalln(err)
	}

	db.MustExec(game.ProblemSchema)
}

func main() {
	err := godotenv.Load(fmt.Sprintf("../.env"))
	if err != nil {
		log.Fatal(".env doesnt exist")
	}
	dbInit()

	rand.Seed(time.Now().UnixNano())
	problem := rngProblem()

	j, err := json.Marshal(problem)
	if err != nil {
		log.Print(err.Error())
	}

	_, err = db.Exec("INSERT INTO problem (problem) VALUES (?)", j)
	if err != nil {
		log.Print(err.Error())
	}

}
