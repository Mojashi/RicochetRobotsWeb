package cmd

import (
	"log"
	"os"

	"github.com/Mojashi/RicochetRobots/api/db"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

func updDBCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "upddb",
		Short: "update db schema",
		Args:  cobra.MinimumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			build()
			if args[0] == "1" {
				UPDV1()
			}
			return nil
		},
	}

	return cmd
}

var d *sqlx.DB

func build() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(".env doesnt exist")
	}

	d = db.NewDB(os.Getenv("DB_HOST"), os.Getenv("DB"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"))
}

func UPDV1() {
	_, err := d.Exec("ALTER TABLE problems ADD randomValue float not null default 0")
	if err != nil {
		panic(err)
	}
	_, err = d.Exec("UPDATE problems SET randomValue=RAND()")
	if err != nil {
		panic(err)
	}
}
