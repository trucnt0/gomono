package api

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/trucnt0/gomono/internal/domain"
	"github.com/trucnt0/gomono/pkg/db"
)

type leadModel struct {
	LeadID uuid.UUID `json:"leadID"`
	Name   string    `json:"name"`
}

func GetLeads(c *fiber.Ctx) error {
	var users []domain.User
	db.Ctx.Find(&users)
	result := lo.Map(users, func(lead domain.User, index int) leadModel {
		return leadModel{
			LeadID: lead.ID,
			Name:   fmt.Sprintf("%s %s", lead.FirstName, lead.LastName),
		}
	})
	return c.JSON(result)
}
