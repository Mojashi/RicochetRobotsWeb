package cmd

import (
	"log"
	"net/url"
	"os"
	"strconv"

	"github.com/Mojashi/RicochetRobots/api/db"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/Mojashi/RicochetRobots/api/twitter"
	"github.com/Mojashi/RicochetRobots/api/utils"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

func getTwitterPicCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "pic",
		Short: "get twitter pic",
		RunE: func(cmd *cobra.Command, args []string) error {
			Run()
			return nil
		},
	}

	return cmd
}

func Run() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(".env doesnt exist")
	}

	db := db.NewDB(os.Getenv("DB_HOST"), os.Getenv("DB"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"))
	twApi := twitter.NewTwitterAPI()
	userRepo := repository.NewUserRepository(db)

	users := userRepo.GetAll()
	userIDs := []int64{}
	idMap := map[string]int{}
	for _, user := range users {
		id, err := strconv.ParseInt(user.TwitterID, 10, 64)
		if err == nil {
			userIDs = append(userIDs, id)
			idMap[user.TwitterID] = user.ID
		}
	}
	res, err := twApi.GetUsersLookupByIds(userIDs, url.Values{})
	if err != nil {
		return
	}
	for _, user := range res {
		if !user.DefaultProfileImage {
			utils.DownloadImage(user.ProfileImageURL, os.Getenv("PUBLIC_DIR")+"/"+strconv.Itoa(idMap[user.IdStr])+".jpg")
		}
	}
	log.Println("completed")
}
