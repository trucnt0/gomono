package api

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/trucnt0/gomono/internal/models"
	"github.com/trucnt0/gomono/pkg/db"
)

type CreateOrUpdateProject struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	LeadID      uuid.UUID `json:"leadID"`
	IsActive    bool      `json:"isActive"`
}

func GetProjects(c *fiber.Ctx) error {
	var projects []models.Project
	var search = c.Query("s")

	fmt.Printf("Search = %d\n", len(search))

	query := db.Ctx.Order("created_date DESC").Preload("Lead")

	if len(search) != 0 {
		query = query.Where("name like ?", fmt.Sprintf("%%%s%%", search))
	}

	res := query.Find(&projects)

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

	project := new(models.Project)
	res := db.Ctx.Where("id = ?", id).Find(&project)
	if res.Error != nil {
		return res.Error
	}

	project.IsActive = model.IsActive
	project.Name = model.Name
	project.Description = model.Description
	project.LeadID = model.LeadID
	db.Ctx.Save(&project)

	return c.Status(http.StatusOK).JSON(project)
}

func DeleteProject(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.SendStatus(http.StatusBadRequest)
	}

	project := new(models.Project)
	res := db.Ctx.Where("id = ?", id).Find(&project)
	if res.Error != nil {
		return res.Error
	}

	db.Ctx.Delete(project)

	return c.SendStatus(http.StatusOK)
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

	project := &models.Project{
		Name:        model.Name,
		Description: model.Description,
		LeadID:      model.LeadID,
		IsActive:    model.IsActive,
	}
	result := db.Ctx.Create(project)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).SendString("Could not create project")
	}
	return c.Status(http.StatusOK).JSON(project)
}

func getLead(id uuid.UUID) *models.User {
	lead := new(models.User)
	db.Ctx.First(&lead, id)
	return lead
}
