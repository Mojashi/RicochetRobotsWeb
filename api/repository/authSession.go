package repository

import (
	"errors"
	"sync"

	"github.com/garyburd/go-oauth/oauth"
)

type IAuthSessionDataSource interface {
	Get(key string) (*oauth.Credentials, error)
	Create(key string, cred *oauth.Credentials) error
}

type AuthSessionDataSource struct {
	sessions *sync.Map
}

func NewAuthSessionRepository() IAuthSessionDataSource {
	return &AuthSessionDataSource{&sync.Map{}}
}

func (r AuthSessionDataSource) Get(key string) (*oauth.Credentials, error) {
	v, ok := r.sessions.Load(key)
	if !ok {
		return nil, errors.New("session not found")
	}
	return v.(*oauth.Credentials), nil
}

func (r AuthSessionDataSource) Create(key string, cred *oauth.Credentials) error {
	r.sessions.Store(key, cred)
	return nil
}
