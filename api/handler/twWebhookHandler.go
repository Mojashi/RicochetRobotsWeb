package handler

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"log"
	"net/http"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/twitter"
	"github.com/labstack/echo/v4"
)

type TwWebHookGroup struct {
	twApi twitter.TwitterAPI
	room  app.IRoomApp
}

func NewTwWebHookGroup(room app.IRoomApp, twApi twitter.TwitterAPI) *TwWebHookGroup {
	tw := &TwWebHookGroup{
		room:  room,
		twApi: twApi,
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
		log.Println(ev.Text)

		// h.room.SendMessage(, msg clientMessage.ClientMessage)
	}
	return c.NoContent(http.StatusOK)
}
