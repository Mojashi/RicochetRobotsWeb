package handler

import "github.com/labstack/echo/v4"

type Handler interface {
	Handle(c echo.Context) error
}
