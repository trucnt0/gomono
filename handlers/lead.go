package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/trucnt0/gomono/database"
	"github.com/trucnt0/gomono/entities"
)

type LeadModel struct {
	LeadID uuid.UUID `json:"leadID"`
	Name   string    `json:"name"`
}

func GetLeads(c *fiber.Ctx) error {
	var users []entities.User
	database.Ctx.Find(&users)
	leads := lo.Map(users, func(lead entities.User, index int) LeadModel {
		return LeadModel{
			LeadID: lead.ID,
			Name:   fmt.Sprintf("%s %s", lead.FirstName, lead.LastName),
		}
	})
	return c.JSON(leads)
}
