package handler

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/trucnt0/gomono/internal/entity"
	"github.com/trucnt0/gomono/pkg/database"
)

type CreateOrUpdateProject struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	LeadID      uuid.UUID `json:"leadID"`
	IsActive    bool      `json:"isActive"`
}

func GetProjects(c *fiber.Ctx) error {
	var projects []entity.Project
	res := database.Ctx.Order("created_at DESC").Preload("Lead").Find(&projects)
	if res.Error != nil {
		return res.Error
	}
	return c.Status(http.StatusOK).JSON(projects)
}

func UpdateProject(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.SendStatus(http.StatusBadRequest)
	}

	model := new(CreateOrUpdateProject)
	if err := c.BodyParser(model); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	project := new(entity.Project)
	res := database.Ctx.Where("id = ?", id).Find(&project)
	if res.Error != nil {
		return res.Error
	}

	project.IsActive = model.IsActive
	project.Name = model.Name
	project.Description = model.Description
	project.LeadID = model.LeadID
	database.Ctx.Save(&project)

	return c.Status(http.StatusOK).JSON(project)
}

func CreateProject(c *fiber.Ctx) error {
	model := new(CreateOrUpdateProject)
	if err := c.BodyParser(model); err != nil {
		return err
	}

	lead := getLead(model.LeadID)
	fmt.Println(lead)
	if lead == nil {
		return c.Status(http.StatusBadRequest).SendString("Lead does not exist.")
	}

	project := &entity.Project{
		Name:        model.Name,
		Description: model.Description,
		LeadID:      model.LeadID,
		IsActive:    model.IsActive,
	}
	result := database.Ctx.Create(project)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).SendString("Could not create project")
	}
	return c.Status(http.StatusOK).JSON(project)
}

func getLead(id uuid.UUID) *entity.User {
	lead := new(entity.User)
	database.Ctx.First(&lead, id)
	return lead
}
