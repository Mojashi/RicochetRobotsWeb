package handler

import (
	"net/http"

	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

func SignoutHandler(c echo.Context) error {
	sess, _ := session.Get("session", c)
	delete(sess.Values, "userID")
	delete(sess.Values, "authorized")
	sess.Save(c.Request(), c.Response())
	return c.NoContent(http.StatusOK)
}
