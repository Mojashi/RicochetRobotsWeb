package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Mojashi/RicochetRobotsWeb/api/arena"
	"github.com/Mojashi/RicochetRobotsWeb/api/db"
	"github.com/Mojashi/RicochetRobotsWeb/api/site"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/labstack/echo-contrib/session"

	_ "github.com/go-sql-driver/mysql"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func init() {
	err := godotenv.Load(fmt.Sprintf("../.env"))
	if err != nil {
		log.Fatal(".env doesnt exist")
	}
	db.DbInit()
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
	arena.Init(g.Group("/arena"), db.DBCon)
	g.GET("/me", site.FetchMeHandler)
	g.GET("/restricted", restricted)

	g.GET("/signout", signoutHandler)
	g.GET("/twitter/signin", singinHandler)
	g.GET("/twitter/callback", OAuthCallbackHandler)

	e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
}
