package main

import (
	"github.com/Mojashi/RicochetRobotsWeb/api/arena"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	g := e.Group("/api/arena")
	arena.Arena(g)
	e.Logger.Fatal(e.Start(":5000"))
}
