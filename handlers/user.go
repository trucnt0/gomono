package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/database"
	"github.com/trucnt0/gomono/entities"
)

type createUserModel struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

// Create a normal user without username & password
func CreateUser(c *fiber.Ctx) error {
	newUser := new(createUserModel)
	if err := c.BodyParser(newUser); err != nil {
		return err
	}

	user := &entities.User{
		FirstName: newUser.FirstName,
		LastName:  newUser.LastName,
		Email:     newUser.Email,
	}

	result := database.Ctx.Create(user)
	if result.Error != nil {
		return result.Error
	}

	return c.JSON(user)
}

func GetUsers(c *fiber.Ctx) error {
	var users []entities.User
	res := database.Ctx.Find(&users)
	if res.Error != nil {
		return res.Error
	}
	//TODO: map to DTO
	return c.JSON(users)
}

func DeleteUser(c *fiber.Ctx) error {
	userId := c.Params("id")
	res := database.Ctx.Where("id = ?", userId).Delete(&entities.User{})
	if res.Error != nil {
		return res.Error
	}
	return c.SendStatus(http.StatusOK)
}
