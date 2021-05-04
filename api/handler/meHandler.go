package handler

import (
	"net/http"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/labstack/echo/v4"
)

func MeHandler(c echo.Context) error {
	if c.Get("authorized") == false {
		return echo.ErrUnauthorized
	}
	user := c.Get("user").(model.User)
	return c.JSON(http.StatusOK, user)
}
