package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/garyburd/go-oauth/oauth"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

type OAuthCallbackHandler struct {
	userRepository         repository.IUserRepository
	authSessionsRepository repository.IAuthSessionDataSource
	twitterOAuthConf       TwitterOAuthConf
	tokenRepository        repository.ITokenDataSource
}

func NewOAuthCallbackHandler(
	userRepository repository.IUserRepository,
	authSessionsRepository repository.IAuthSessionDataSource,
	twitterOAuthConf TwitterOAuthConf,
	tokenRepository repository.ITokenDataSource,
) Handler {
	return &OAuthCallbackHandler{userRepository, authSessionsRepository, twitterOAuthConf, tokenRepository}
}

// serveOAuthCallback handles callbacks from the OAuth server.
func (h OAuthCallbackHandler) Handle(c echo.Context) error {
	s, err := session.Get("twauth", c)
	if err != nil {
		return echo.ErrInternalServerError
	}
	key := ""
	ok := false
	if key, ok = s.Values[h.twitterOAuthConf.authKey].(string); !ok {
		return echo.ErrInternalServerError
	}
	tempCred, _ := h.authSessionsRepository.Get(key)

	if tempCred == nil || tempCred.Token != c.FormValue("oauth_token") {
		return echo.NewHTTPError(http.StatusInternalServerError, "Unknown oauth_token.")

	}
	tokenCred, values, err := h.twitterOAuthConf.oauthClient.RequestToken(nil, tempCred, c.FormValue("oauth_verifier"))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error getting request token, "+err.Error())
	}

	log.Println(values)
	twitterID := values["user_id"][0]
	screenName := values["screen_name"][0]
	user := model.User{}

	if user, err = h.userRepository.GetByTwID(twitterID); err != nil {
		if user, err = h.userRepository.Create(screenName, twitterID); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Error creating user, "+err.Error())
		}
	}
	err = getTwitterPic(h.twitterOAuthConf.oauthClient, tokenCred, user)
	if err != nil {
		log.Println(err.Error())
	}
	// userInfo := map[string]interface{}{}
	// if err = apiGet(tokenCred, "https://api.twitter.com/1.1/account/verify_credentials.json", url.Values{}, &userInfo); err != nil {
	// 	return echo.NewHTTPError(http.StatusInternalServerError, "Error fetching user information from twitter, "+err.Error())
	// }
	// log.Println(userInfo)
	h.tokenRepository.Create(key, tokenCred)
	// delete(s.Values, tempCredKey)
	// delete(authSessions, key)
	// s.Values[tokenCredKey] = tokenCred

	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}
	sess.Values["userID"] = user.ID
	sess.Save(c.Request(), c.Response())

	if err := s.Save(c.Request(), c.Response()); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error saving session, "+err.Error())
	}
	return c.HTML(http.StatusOK, "<html><body onload=\"window.close()\"></body></html>")
}

func getTwitterPic(c oauth.Client, cred *oauth.Credentials, user model.User) error {
	res, err := c.Get(nil, cred, `https://api.twitter.com/1.1/users/show.json`, url.Values{"user_id": {user.TwitterID}})
	if err != nil {
		return err
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}
	mp := map[string]interface{}{}
	json.Unmarshal(body, &mp)
	imgUrl := mp["profile_image_url_https"].(string)
	return downloadImage(imgUrl, os.Getenv("PUBLIC_DIR")+fmt.Sprint(user.ID)+".jpg")
}

func downloadImage(url string, savePath string) error {
	response, e := http.Get(url)
	if e != nil {
		return e
	}
	defer response.Body.Close()

	file, err := os.Create(savePath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.Copy(file, response.Body)
	return err
}
