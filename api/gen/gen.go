package gen

import (
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/Mojashi/RicochetRobots/api/db"
	"github.com/Mojashi/RicochetRobots/api/repository"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var (
	problemRepository repository.IProblemWithSolutionRepository
)

func build() {

	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(".env doesnt exist")
	}

	db := db.NewDB(os.Getenv("DB_HOST"), os.Getenv("DB"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"))
	problemRepository = repository.NewProblemWithSolutionRepository(db)
}

func Gen(torus, mirror bool) {
	build()

	for {
		rand.Seed(time.Now().UnixNano())
		problem := rngProblemWithSolution(torus, mirror, 10)

		err := problemRepository.Create(problem)
		if err != nil {
			log.Fatal(err)
		}
	}
}
