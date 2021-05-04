package repository

import (
	"errors"
	"sync"

	"github.com/garyburd/go-oauth/oauth"
)

type ITokenDataSource interface {
	Get(key string) (*oauth.Credentials, error)
	Create(key string, cred *oauth.Credentials) error
}

type TokenDataSource struct {
	tokens *sync.Map
}

func NewTokenDataSource() ITokenDataSource {
	return &TokenDataSource{&sync.Map{}}
}

func (r TokenDataSource) Get(key string) (*oauth.Credentials, error) {
	v, ok := r.tokens.Load(key)
	if !ok {
		return nil, errors.New("session not found")
	}
	return v.(*oauth.Credentials), nil
}

func (r TokenDataSource) Create(key string, cred *oauth.Credentials) error {
	r.tokens.Store(key, cred)
	return nil
}
