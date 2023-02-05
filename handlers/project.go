package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/database"
	"github.com/trucnt0/gomono/entities"
)

type ProjectModel struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	LeadID      string `json:"leadID"`
	IsActive    bool   `json:"isActive"`
}

func GetProjects(c *fiber.Ctx) error {
	var projects []entities.Project
	res := database.Ctx.Preload("Lead").Find(&projects)
	if res.Error != nil {
		return res.Error
	}
	return c.Status(http.StatusOK).JSON(projects)
}

func CreateProject(c *fiber.Ctx) error {
	model := new(ProjectModel)
	if err := c.BodyParser(model); err != nil {
		return err
	}

	leadID, _ := strconv.Atoi(model.LeadID)
	lead := getLead(leadID)
	fmt.Println(lead)
	if lead == nil {
		return c.Status(http.StatusBadRequest).SendString("Lead does not exist.")
	}

	project := &entities.Project{
		Name:        model.Name,
		Description: model.Description,
		LeadID:      leadID,
		IsActive:    true,
	}
	result := database.Ctx.Create(project)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).SendString("Could not create project")
	}
	return c.Status(http.StatusOK).JSON(project)
}

func getLead(id int) *entities.User {
	lead := new(entities.User)
	database.Ctx.First(&lead, id)
	return lead
}