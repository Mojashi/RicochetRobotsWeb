package apiServer

import (
	"log"
	"os"
	"strings"

	"github.com/Mojashi/RicochetRobots/api/app/roomManager"
	"github.com/Mojashi/RicochetRobots/api/db"
	"github.com/Mojashi/RicochetRobots/api/handler"
	"github.com/Mojashi/RicochetRobots/api/middleware"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/Mojashi/RicochetRobots/api/twitter"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/labstack/echo-contrib/session"

	_ "github.com/go-sql-driver/mysql"

	"github.com/labstack/echo/v4"
	echoMid "github.com/labstack/echo/v4/middleware"
)

var (
	callbackHandler      handler.Handler
	singinHandler        handler.Handler
	joinHandler          handler.Handler
	makeRoomHandler      handler.Handler
	getRankingHandler    handler.Handler
	roomListHandler      handler.Handler
	twitterWebhookGroup  *handler.TwWebHookGroup
	cookieAuthMiddleware middleware.CookieAuthMiddleware
)

func build() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(".env doesnt exist")
	}
	log.Println(os.Getenv("HOME"))
	log.Println(os.Getenv("DB_HOST"))
	db := db.NewDB(os.Getenv("DB_HOST"), os.Getenv("DB"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"))
	twApi := twitter.NewTwitterAPI()

	authSessionRepo := repository.NewAuthSessionRepository()
	problemRepo := repository.NewProblemWithSolutionRepository(db)
	tokenRepo := repository.NewTokenDataSource()
	userRepo := repository.NewUserRepository(db)
	arenaLogRepo := repository.NewAreanLogRepository(db)

	roomManager := roomManager.NewRoomManager(problemRepo, arenaLogRepo, userRepo, twApi)

	twitterOAuthConf := handler.NewTwitterOAuthConf()

	callbackHandler = handler.NewOAuthCallbackHandler(userRepo, authSessionRepo, twitterOAuthConf, tokenRepo)
	singinHandler = handler.NewSigninHandler(authSessionRepo, twitterOAuthConf)
	cookieAuthMiddleware = middleware.NewCookieAuthMiddleware(userRepo)
	joinHandler = handler.NewJoinHandler(roomManager)
	makeRoomHandler = handler.NewMakeRoomHandler(roomManager)
	roomListHandler = handler.NewRoomListHandler(roomManager)
	getRankingHandler = handler.NewGetRankingHandler(userRepo)

	roomManager.NewArena()
	arena, _ := roomManager.Get(0)
	twitterWebhookGroup = handler.NewTwWebHookGroup(arena, userRepo, twApi)
}

func Run() {
	build()

	e := echo.New()
	e.Use(echoMid.Logger())
	e.Use(echoMid.Recover())

	store := sessions.NewCookieStore([]byte(os.Getenv("SECRET")))
	store.MaxAge(86400)
	e.Use(session.Middleware(store))
	e.Use(cookieAuthMiddleware.Handle)

	g := e.Group("/api")
	g.GET("/users/me", handler.MeHandler)
	g.GET("/users/ranking", getRankingHandler.Handle)

	g.GET("/signout", handler.SignoutHandler)
	g.GET("/twitter/signin", singinHandler.Handle)
	g.GET("/twitter/callback", callbackHandler.Handle)

	g.POST("/rooms/make", makeRoomHandler.Handle)
	g.GET("/join/:roomID", joinHandler.Handle)
	g.GET("/rooms", roomListHandler.Handle)

	twitterWebhookGroup.Make(g.Group("/twitter"))

	e.Use(echoMid.StaticWithConfig(echoMid.StaticConfig{
		Skipper: func(c echo.Context) bool {
			return strings.HasPrefix(c.Request().URL.Path, "/userPics") || strings.HasPrefix(c.Request().URL.Path, "/api")
		},
		Root:  os.Getenv("PUBLIC_DIR"),
		HTML5: true,
	}))
	e.Use(echoMid.StaticWithConfig(echoMid.StaticConfig{
		Skipper: func(c echo.Context) bool {
			return strings.HasPrefix(c.Request().URL.Path, "/api")
		},
		Root:  os.Getenv("USERPIC_DIR"),
		HTML5: true,
	}))

	e.Logger.Fatal(e.Start(":" + os.Getenv("API_PORT")))
}
