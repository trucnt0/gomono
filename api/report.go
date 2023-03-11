package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/samber/lo"
	"github.com/trucnt0/gomono/pkg/db"
)

type ProjectCountByUser struct {
	Count     int    `json:"count"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type ProjectCountModel struct {
	Count    int    `json:"count"`
	FullName string `json:"fullName"`
}

type StatsModel struct {
	ProjectCount         int64 `json:"projectCount"`
	TodayProjectCount    int64 `json:"todayProjectCount"`
	ActiveProjectCount   int64 `json:"activeProjectCount"`
	InactiveProjectCount int64 `json:"inactiveProjectCount"`
	UserCount            int64 `json:"userCount"`
	TodayUserCount       int64 `json:"todayUserCount"`
}

func GetStats(c *fiber.Ctx) error {
	res := &StatsModel{}
	db.Ctx.Table("projects").Count(&res.ProjectCount)
	//TODO: compare date only
	db.Ctx.Table("projects").Where("created_date = ?", time.Now().String()).Count(&res.TodayProjectCount)
	db.Ctx.Table("projects").Where("is_active = 1").Count(&res.ActiveProjectCount)
	db.Ctx.Table("projects").Where("is_active = 0").Count(&res.InactiveProjectCount)
	db.Ctx.Table("users").Count(&res.UserCount)
	//TODO: compare date only
	db.Ctx.Table("users").Where("created_date = ?", time.Now().String()).Count(&res.TodayUserCount)

	fmt.Println(res)

	return c.JSON(res)
}

func GetProjectCountByLead(c *fiber.Ctx) error {
	var dataset []ProjectCountByUser
	res := db.Ctx.
		Table("projects").
		Joins("join users on projects.lead_id = users.id").
		Select("users.first_name, users.last_name", "count(projects.id) as count").
		Group("users.first_name, users.last_name").
		Scan(&dataset)

	if res.Error != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	result := lo.Map(dataset, func(item ProjectCountByUser, index int) ProjectCountModel {
		return ProjectCountModel{
			Count:    item.Count,
			FullName: fmt.Sprintf("%s %s", item.FirstName, item.LastName),
		}
	})

	return c.JSON(result)
}
