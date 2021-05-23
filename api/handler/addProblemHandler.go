package handler

import (
	"crypto/subtle"
	"os"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/labstack/echo/v4"
)

type AddProblemHandler struct {
	problemRepository repository.IProblemWithSolutionRepository
}

func NewAddProblemHandler(problemRepository repository.IProblemWithSolutionRepository) Handler {
	return &AddProblemHandler{problemRepository: problemRepository}
}

func (h AddProblemHandler) Handle(c echo.Context) error {
	var body PBody
	c.Bind(&body)

	if subtle.ConstantTimeCompare([]byte(body.Password), []byte(os.Getenv("ADMIN_PASSWORD"))) == 0 {
		return echo.ErrForbidden
	}

	err := h.problemRepository.Create(body.Problem)
	if err != nil {
		return err
	}
	return c.String(200, "added")
}

type PBody struct {
	Password string                    `json:"password"`
	Problem  model.ProblemWithSolution `json:"problem"`
}
