package handler

import (
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/labstack/echo/v4"
)

type GetRankingHandler struct {
	userRepository repository.IUserRepository
}

func NewGetRankingHandler(userRepository repository.IUserRepository) Handler {
	return &GetRankingHandler{userRepository: userRepository}
}

func (h GetRankingHandler) Handle(c echo.Context) error {
	rank := h.userRepository.GetRanking(5)

	return c.JSON(200, rank)
}
