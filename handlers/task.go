package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/database"
	"github.com/trucnt0/gomono/entities"
)

func GetTasks(c *fiber.Ctx) error {
	var tasks []entities.Task
	res := database.Ctx.Find(&tasks)
	if res.Error != nil {
		return res.Error
	}
	return c.Status(http.StatusOK).JSON(tasks)
}
