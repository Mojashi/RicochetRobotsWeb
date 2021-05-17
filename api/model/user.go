package model

import "math/rand"

type UserID = int

type User struct {
	ID            UserID `json:"id" db:"id"`
	Name          string `json:"name" db:"name"`
	TwitterID     string `json:"twitterID" db:"twitterID"`
	ArenaWinCount int    `json:"arenaWinCount" db:"arenaWinCount"`
}

type UserWithArenaRank struct {
	User
	ArenaWin int `json:"arenaWin"`
	Rank     int `json:"rank"`
}

func GetGurstUser() User {
	return User{
		ID:        UserID(rand.Intn(1000000) + 100000),
		Name:      "guest",
		TwitterID: "",
	}
}

func IsGuestUser(user User) bool {
	return user.ID >= 100000
}

var SuperUser User

func init() {
	SuperUser = User{
		ID:        -12345,
		Name:      "system",
		TwitterID: "",
	}
}
