package api

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/trucnt0/gomono/internal/models"
	"github.com/trucnt0/gomono/pkg/db"
)

type createUserModel struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

type userModel struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	FullName  string    `json:"fullName"`
	Email     string    `json:"email"`
	UserName  string    `json:"userName"`
}

// Create a normal user without username & password
func CreateUser(c *fiber.Ctx) error {
	newUser := new(createUserModel)
	if err := c.BodyParser(newUser); err != nil {
		return c.Status(http.StatusBadRequest).JSON(err)
	}

	user := &models.User{
		FirstName: newUser.FirstName,
		LastName:  newUser.LastName,
		Email:     newUser.Email,
	}

	result := db.Ctx.Create(user)
	if result.Error != nil {
		return c.Status(http.StatusBadRequest).JSON(result.Error)
	}

	return c.JSON(user)
}

func GetUsers(c *fiber.Ctx) error {
	var users []models.User
	res := db.Ctx.Find(&users)
	if res.Error != nil {
		return c.Status(http.StatusBadRequest).JSON(res.Error)
	}

	result := lo.Map(users, func(u models.User, index int) userModel {
		return userModel{
			ID:        u.ID,
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Email:     u.Email,
			FullName:  fmt.Sprintf("%s %s", u.FirstName, u.LastName),
			UserName:  u.UserName,
		}
	})

	return c.JSON(result)
}

func DeleteUser(c *fiber.Ctx) error {
	userId := c.Params("id")
	res := db.Ctx.Where("id = ?", userId).Delete(&models.User{})
	if res.Error != nil {
		return c.Status(http.StatusBadRequest).JSON(res.Error)
	}
	return c.SendStatus(http.StatusOK)
}
