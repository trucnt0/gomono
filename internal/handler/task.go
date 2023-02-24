package handler

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/internal/entity"
	"github.com/trucnt0/gomono/pkg/database"
)

func GetTasks(c *fiber.Ctx) error {
	var tasks []entity.Task
	res := database.Ctx.Find(&tasks)
	if res.Error != nil {
		return res.Error
	}
	return c.Status(http.StatusOK).JSON(tasks)
}
