package model

type UserID = int

type User struct {
	ID        UserID `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	TwitterID string `json:"twitterID" db:"twitterID"`
}

var SuperUser User

func init() {
	SuperUser = User{
		ID:        -12345,
		Name:      "system",
		TwitterID: "",
	}
}
