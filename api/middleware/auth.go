package middleware

import (
	"log"
	"time"

	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/Mojashi/RicochetRobots/api/repository"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

type Auth struct {
	UserID model.UserID
	Iat    int64
}

const (
	userIDKey = "userID"
	iatKey    = "iat"
	expKey    = "exp"
	lifetime  = 30 * time.Minute
)

type CookieAuthMiddleware struct {
	userRepository repository.IUserRepository
}

func NewCookieAuthMiddleware(userRepository repository.IUserRepository) CookieAuthMiddleware {
	return CookieAuthMiddleware{userRepository}
}

func (m CookieAuthMiddleware) Handle(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)
		val, ok := sess.Values["userID"]
		if ok {
			if user, err := m.userRepository.Get(val.(model.UserID)); err == nil {
				c.Set("user", user)
				c.Set("authorized", true)
				log.Printf("cookie:user:%s authed:%s\n", c.Get("user").(model.User).Name, c.Get("authorized").(bool))
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
