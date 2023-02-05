package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/database"
	"github.com/trucnt0/gomono/entities"
)

func GetLeads(c *fiber.Ctx) error {
	var leads []entities.User
	database.Ctx.Find(&leads)
	return c.JSON(leads)
}
