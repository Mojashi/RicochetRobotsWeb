package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"sync"

	"github.com/Mojashi/RicochetRobotsWeb/api/site"
	"github.com/garyburd/go-oauth/oauth"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

// Session state keys.
const (
	authKey      = "authSessId"
	tokenCredKey = "tokenCred"
)

var authSessions sync.Map
var tokens sync.Map

var callback string

var oauthClient = oauth.Client{
	TemporaryCredentialRequestURI: "https://api.twitter.com/oauth/request_token",
	ResourceOwnerAuthorizationURI: "https://api.twitter.com/oauth/authorize",
	TokenRequestURI:               "https://api.twitter.com/oauth/access_token",
}

var signinOAuthClient oauth.Client

var credPath = flag.String("config", "../config.json", "Path to configuration file containing the application's credentials.")

func init() {
	callback = "http://" + os.Getenv("DOMAIN") + ":" + os.Getenv("FRONT_PORT") + "/api/twitter/callback"
	b, err := ioutil.ReadFile(*credPath)
	if err != nil {
		log.Fatal("not found config.json")
	}
	if json.Unmarshal(b, &oauthClient.Credentials) != nil {
		log.Fatal("couldn't load credential informations.")
	}
	signinOAuthClient = oauthClient
	signinOAuthClient.ResourceOwnerAuthorizationURI = "https://api.twitter.com/oauth/authenticate"

}

// serveSignin gets the OAuth temp credentials and redirects the user to the
// Twitter's authentication page.
func singinHandler(c echo.Context) error {
	tempCred, err := signinOAuthClient.RequestTemporaryCredentials(nil, callback, nil)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error getting temp cred, "+err.Error())
	}
	s, _ := session.Get("twauth", c)

	var buf [16]byte
	_, err = rand.Read(buf[:])
	if err != nil {
		return err
	}
	key := hex.EncodeToString(buf[:])

	s.Values[authKey] = key
	authSessions.Store(key, tempCred)

	if err := s.Save(c.Request(), c.Response()); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error saving session, "+err.Error())
	}
	return c.JSON(http.StatusOK, map[string]string{"url": signinOAuthClient.AuthorizationURL(tempCred, nil)})
}

// serveOAuthCallback handles callbacks from the OAuth server.
func OAuthCallbackHandler(c echo.Context) error {
	s, err := session.Get("twauth", c)
	if err != nil {
		return echo.ErrInternalServerError
	}
	key := ""
	ok := false
	if key, ok = s.Values[authKey].(string); !ok {
		return echo.ErrInternalServerError
	}
	tempCredb, _ := authSessions.Load(key)
	tempCred := tempCredb.(*oauth.Credentials)

	if tempCred == nil || tempCred.Token != c.FormValue("oauth_token") {
		return echo.NewHTTPError(http.StatusInternalServerError, "Unknown oauth_token.")

	}
	tokenCred, values, err := oauthClient.RequestToken(nil, tempCred, c.FormValue("oauth_verifier"))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error getting request token, "+err.Error())
	}
	log.Println(values)
	twitterID := values["user_id"][0]
	screenName := values["screen_name"][0]
	user := site.User{}
	if user, err = site.CreateUser(screenName, twitterID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error creating user, "+err.Error())
	}
	// userInfo := map[string]interface{}{}
	// if err = apiGet(tokenCred, "https://api.twitter.com/1.1/account/verify_credentials.json", url.Values{}, &userInfo); err != nil {
	// 	return echo.NewHTTPError(http.StatusInternalServerError, "Error fetching user information from twitter, "+err.Error())
	// }
	// log.Println(userInfo)
	tokens.Store(key, tokenCred)
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

func apiGet(cred *oauth.Credentials, urlStr string, form url.Values, data interface{}) error {
	resp, err := oauthClient.Get(nil, cred, urlStr, form)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return decodeResponse(resp, data)
}

// decodeResponse decodes the JSON response from the Twitter API.
func decodeResponse(resp *http.Response, data interface{}) error {
	if resp.StatusCode != 200 {
		p, _ := ioutil.ReadAll(resp.Body)
		return fmt.Errorf("get %s returned status %d, %s", resp.Request.URL, resp.StatusCode, p)
	}
	return json.NewDecoder(resp.Body).Decode(data)
}
