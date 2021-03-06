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

func Gen(torus, mirror int, remote string) {
	log.Println(torus, mirror, remote)
	build()

	for {
		rand.Seed(time.Now().UnixNano())
		bt := torus == 1
		bm := mirror == 1
		if torus == 2 {
			bt = rand.Int()%2 == 0
		}
		if mirror == 2 {
			bm = rand.Int()%2 == 0
		}
		log.Println(bt, bm)
		problem := rngProblemWithSolution(bt, bm, 30)

		if remote != "" {
			str, err := json.Marshal(handler.PBody{
				Password: os.Getenv("ADMIN_PASSWORD"),
				Problem:  problem,
			})
			if err != nil {
				panic(err)
			}
			resp, err := http.Post(remote+"/api/addProblem", "application/json", bytes.NewReader(str))
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
