package handler

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/internal/entity"
	"github.com/trucnt0/gomono/pkg/database"
)

type RoleModel struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func GetRoles(c *fiber.Ctx) error {
	var roles []entity.Role
	res := database.Ctx.Find(&roles)
	if res.Error != nil {
		return res.Error
	}
	return c.JSON(roles)
}

func CreateRole(c *fiber.Ctx) error {
	req := &RoleModel{}
	if err := c.BodyParser(req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(err)
	}

	role := &entity.Role{
		Name:        req.Name,
		Description: req.Description,
	}
	result := database.Ctx.Create(role)
	if result.Error != nil {
		return c.Status(http.StatusBadRequest).JSON(result.Error)
	}
	return c.JSON(role)
}
