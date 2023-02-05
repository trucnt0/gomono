package entities

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FirstName      string
	LastName       string
	UserName       string
	HashedPassword string
	Email          string
}
