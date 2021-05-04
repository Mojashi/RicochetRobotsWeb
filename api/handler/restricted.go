package handler

import (
	"net/http"

	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

func RestrictedHandler(c echo.Context) error {
	sess, _ := session.Get("session", c)
	val, ok := sess.Values["userID"]
	if !ok {
		return c.String(http.StatusOK, "please login")
	}
	return c.String(http.StatusOK, "welcome home! "+val.(string))
}
