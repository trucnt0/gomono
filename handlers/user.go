package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/database"
	"github.com/trucnt0/gomono/entities"
)

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
	res := database.Ctx.Delete(&entities.User{}, userId)
	if res.Error != nil {
		return res.Error
	}
	return c.SendStatus(http.StatusOK)
}
