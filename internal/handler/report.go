package handler

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/samber/lo"
	"github.com/trucnt0/gomono/pkg/db"
)

type projectCountByUser struct {
	Count     int    `json:"count"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type projectCountResult struct {
	Count    int    `json:"count"`
	FullName string `json:"fullName"`
}

func GetProjectCountByLead(c *fiber.Ctx) error {
	var dataset []projectCountByUser
	res := db.Ctx.
		Table("projects").
		Joins("join users on projects.lead_id = users.id").
		Select("users.first_name, users.last_name", "count(projects.id) as count").
		Group("users.first_name, users.last_name").
		Scan(&dataset)

	if res.Error != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	result := lo.Map(dataset, func(item projectCountByUser, index int) projectCountResult {
		return projectCountResult{
			Count:    item.Count,
			FullName: fmt.Sprintf("%s %s", item.FirstName, item.LastName),
		}
	})

	return c.JSON(result)
}
