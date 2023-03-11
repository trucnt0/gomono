package api

import (
	"fmt"
	"net/http"
	"time"

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

type stats struct {
	projectCount         int64
	todayProjectCount    int64
	activeProjectCount   int64
	inactiveProjectCount int64
	userCount            int64
	todayUserCount       int64
}

func GetStats(c *fiber.Ctx) error {
	var stats = new(stats)
	db.Ctx.Model("projects").Count(&stats.projectCount)
	//TODO: compare date only
	db.Ctx.Model("projects").Where("created_date = ?", time.Now().String()).Count(&stats.todayProjectCount)
	db.Ctx.Model("projects").Where("is_active = 1").Count(&stats.activeProjectCount)
	db.Ctx.Model("projects").Where("is_active = 0").Count(&stats.inactiveProjectCount)
	db.Ctx.Model("users").Count(&stats.userCount)
	//TODO: compare date only
	db.Ctx.Model("users").Where("created_date = ?", time.Now().String()).Count(&stats.todayUserCount)
	return c.JSON(stats)
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
