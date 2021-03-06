package handler

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"os"

	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/garyburd/go-oauth/oauth"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

type TwitterOAuthConf struct {
	callback          string
	oauthClient       oauth.Client
	signinOAuthClient oauth.Client
	authKey           string
	tokenCredKey      string
}

func NewTwitterOAuthConf() TwitterOAuthConf {
	oauthClient := oauth.Client{
		TemporaryCredentialRequestURI: "https://api.twitter.com/oauth/request_token",
		ResourceOwnerAuthorizationURI: "https://api.twitter.com/oauth/authorize",
		TokenRequestURI:               "https://api.twitter.com/oauth/access_token",
	}
	oauthClient.Credentials.Secret = os.Getenv("CONSUMER_SECRET")
	oauthClient.Credentials.Token = os.Getenv("CONSUMER_KEY")

	signinOAuthClient := oauthClient
	signinOAuthClient.ResourceOwnerAuthorizationURI = "https://api.twitter.com/oauth/authenticate"

	return TwitterOAuthConf{
		os.Getenv("PUBLIC_URL") + "/api/twitter/callback",
		oauthClient,
		signinOAuthClient,
		"authSessId",
		"tokenCred",
	}
}

type SigninHandler struct {
	authSessions     repository.IAuthSessionDataSource
	twitterOAuthConf TwitterOAuthConf
}

func NewSigninHandler(
	authSessions repository.IAuthSessionDataSource,
	twitterOAuthConf TwitterOAuthConf,
) Handler {
	return &SigninHandler{
		authSessions,
		twitterOAuthConf,
	}
}

// serveSignin gets the OAuth temp credentials and redirects the user to the
// Twitter's authentication page.
func (h *SigninHandler) Handle(c echo.Context) error {

	tempCred, err := h.twitterOAuthConf.signinOAuthClient.RequestTemporaryCredentials(nil, h.twitterOAuthConf.callback, nil)
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

	s.Values[h.twitterOAuthConf.authKey] = key
	h.authSessions.Create(key, tempCred)

	if err := s.Save(c.Request(), c.Response()); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error saving session, "+err.Error())
	}
	return c.JSON(http.StatusOK, map[string]string{"url": h.twitterOAuthConf.signinOAuthClient.AuthorizationURL(tempCred, nil)})
}
