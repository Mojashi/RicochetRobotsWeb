package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Mojashi/RicochetRobotsWeb/api/arena"
	"github.com/Mojashi/RicochetRobotsWeb/api/game"
	"github.com/Mojashi/RicochetRobotsWeb/api/site"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/labstack/echo-contrib/session"

	_ "github.com/go-sql-driver/mysql"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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
	db.MustExec(site.UserSchema)
}

func init() {
	err := godotenv.Load(fmt.Sprintf("../.env"))
	if err != nil {
		log.Fatal(".env doesnt exist")
	}
	dbInit()
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	store := sessions.NewCookieStore([]byte(os.Getenv("SECRET")))
	store.MaxAge(86400)
	e.Use(session.Middleware(store))
	e.Use(cookieAuthMiddleware)

	g := e.Group("/api")
	arena.Init(g.Group("/arena"), db)
	g.GET("/me", site.FetchMeHandler)
	g.GET("/restricted", restricted)

	g.GET("/signout", signoutHandler)
	g.GET("/twitter/signin", singinHandler)
	g.GET("/twitter/callback", OAuthCallbackHandler)

	e.Logger.Fatal(e.Start(":5000"))
}
