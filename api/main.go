package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Mojashi/RicochetRobots/api/cmd"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(".env doesnt exist")
	}
	os.Chdir(os.Getenv("ROOT_DIR"))
}

func main() {
	if err := cmd.RootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "%s: %v\n", os.Args[0], err)
		os.Exit(-1)
	}
}
