package entities

type User struct {
	Base
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	UserName       string `json:"userName"`
	HashedPassword string `json:"hashedPassword"`
	Email          string `json:"email"`
}
