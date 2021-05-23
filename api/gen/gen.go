package gen

import (
	"bytes"
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/Mojashi/RicochetRobots/api/db"
	"github.com/Mojashi/RicochetRobots/api/handler"
	"github.com/Mojashi/RicochetRobots/api/repository"
	_ "github.com/go-sql-driver/mysql"
)

var (
	problemRepository repository.IProblemWithSolutionRepository
)

func build() {
	db := db.NewDB(os.Getenv("DB_HOST"), os.Getenv("DB"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"))
	problemRepository = repository.NewProblemWithSolutionRepository(db)
}

func Gen(torus, mirror bool, remote string) {
	build()

	for {
		rand.Seed(time.Now().UnixNano())
		problem := rngProblemWithSolution(torus, mirror, 10)

		if remote != "" {
			str, err := json.Marshal(handler.PBody{
				Password: os.Getenv("ADMIN_PASSWORD"),
				Problem:  problem,
			})
			if err != nil {
				panic(err)
			}
			resp, err := http.Post(remote, "application/json", bytes.NewReader(str))
			if err != nil {
				panic(err)
			}
			log.Println(resp.Status)
		} else {
			err := problemRepository.Create(problem)
			if err != nil {
				log.Fatal(err)
			}
		}
	}
}
