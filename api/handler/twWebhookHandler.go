package handler

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"log"
	"net/http"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/app/client"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/Mojashi/RicochetRobots/api/twitter"
	"github.com/labstack/echo/v4"
)

type TwWebHookGroup struct {
	twApi          twitter.TwitterAPI
	userRepository repository.IUserRepository
	room           app.IRoomApp
}

func NewTwWebHookGroup(room app.IRoomApp, userRepository repository.IUserRepository, twApi twitter.TwitterAPI) *TwWebHookGroup {
	tw := &TwWebHookGroup{
		room:           room,
		twApi:          twApi,
		userRepository: userRepository,
	}
	return tw
}

func (t TwWebHookGroup) Make(g *echo.Group) {
	g.GET("/webhook", t.HandleCRCCheck)
	g.POST("/webhook", t.HandleActivity)
}

func (h *TwWebHookGroup) HandleCRCCheck(c echo.Context) error {
	token := c.QueryParam("crc_token")

	mac := hmac.New(sha256.New, []byte(h.twApi.ConsumerSecret))
	mac.Write([]byte(token))
	return c.JSON(200, map[string]string{"response_token": "sha256=" + base64.StdEncoding.EncodeToString(mac.Sum(nil))})
}

func (h *TwWebHookGroup) HandleActivity(c echo.Context) error {
	req := twitter.PostTwitterActivityRequest{}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	for _, ev := range req.TweetCreateEvents {
		twitterID := ev.User.IDStr
		user, err := h.userRepository.GetByTwID(twitterID)
		if err != nil {
			user, err = h.userRepository.Create(ev.User.ScreenName, ev.User.IDStr)
			if err != nil {
				log.Println(err.Error())
				continue
			}
		}
		_, err = model.StrToHands(ev.Text)
		if err == nil {
			log.Println(ev.Text)
			c := client.NewTwitterClient(user, h.twApi, h.room)
			c.Submit(ev)
			// h.room.SendMessage(, msg clientMessage.ClientMessage)
		}
	}
	return c.NoContent(http.StatusOK)
}
