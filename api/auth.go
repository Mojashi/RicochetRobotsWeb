package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Mojashi/RicochetRobotsWeb/api/site"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

type Auth struct {
	UserID string
	Iat    int64
}

const (
	userIDKey = "userID"
	iatKey    = "iat"
	expKey    = "exp"
	lifetime  = 30 * time.Minute
)

var (
	secret []byte
)

func init() {
	secret = []byte(os.Getenv("SECRET"))
}

// func login(c echo.Context) error {
// 	m := echo.Map{}
// 	err := c.Bind(&m)
// 	fmt.Println(err)
// 	username := m["username"].(string)
// 	password := m["password"].(string)
// 	fmt.Println("name:" + username)
// 	fmt.Println("pass:" + password)

// 	// とりあえずのパスワード認証
// 	if username != "taro" || password != "shhh!" {
// 		return echo.ErrUnauthorized
// 	}

// 	sess, _ := session.Get("session", c)
// 	sess.Options = &sessions.Options{
// 		Path:     "/",
// 		MaxAge:   86400 * 7,
// 		HttpOnly: true,
// 	}

// 	sess.Values["userID"] = "taro"
// 	sess.Save(c.Request(), c.Response())
// 	return c.JSON(http.StatusOK, map[string]string{"name": "taro"})
// }

// func register(c echo.Context) error {

// }

func cookieAuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)
		val, ok := sess.Values["userID"]
		if ok {
			if user, err := site.FetchUserByID(db, val.(int)); err == nil {
				c.Set("user", user)
				c.Set("authorized", true)
				log.Printf("cookie:user:%s authed:%d\n", c.Get("user").(site.User).Name, c.Get("authorized").(bool))
			} else {
				c.Set("authorized", false)
				log.Println("unauth by " + err.Error())
			}
		} else {
			c.Set("authorized", false)
			log.Println("unauth2")
		}

		err := next(c)
		return err
	}
}

func signoutHandler(c echo.Context) error {
	sess, _ := session.Get("session", c)
	delete(sess.Values, "userID")
	delete(sess.Values, "authorized")
	sess.Save(c.Request(), c.Response())
	return c.NoContent(http.StatusOK)
}

func restricted(c echo.Context) error {
	sess, _ := session.Get("session", c)
	val, ok := sess.Values["userID"]
	if !ok {
		return c.String(http.StatusOK, "please login")
	}
	return c.String(http.StatusOK, "welcome home! "+val.(string))
}
