package domain

import (
	"fmt"

	"github.com/google/uuid"
)

type User struct {
	Base
	FirstName      string
	LastName       string
	UserName       string
	Email          string
	HashedPassword string
}

type UserRepository interface {
	Create(user *User) (*User, error)
	Update(id uuid.UUID, user *User) error
	Delete(id uuid.UUID) error
	GetByID(id uuid.UUID) (*User, error)
	GetByUserName(userName string) (*User, error)
	GetAll() ([]User, error)
}

func (u *User) GetFullName() string {
	return fmt.Sprintf("%s %s", u.FirstName, u.LastName)
}
