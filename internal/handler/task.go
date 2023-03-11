package handler

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/internal/entity"
	"github.com/trucnt0/gomono/internal/repo"
	"github.com/trucnt0/gomono/pkg/db"
)

type CreateTaskModel struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	AssigneeID  int    `json:"assigneeID"`
	CreatedByID int    `json:"createdByID"`
	ProjectID   int    `json:"projectID"`
}

func GetTasks(c *fiber.Ctx) error {
	var tasks []entity.Task
	res := db.Ctx.Find(&tasks)
	if res.Error != nil {
		return res.Error
	}
	return c.Status(http.StatusOK).JSON(tasks)
}

func CreateTask(c *fiber.Ctx) error {
	model := CreateTaskModel{}
	if err := c.BodyParser(model); err != nil {
		return err
	}

	project := repo.GetProjectByID(model.ProjectID)
	if project == nil {
		return c.Status(http.StatusBadRequest).SendString("Project does not exist")
	}

	task := entity.Task{
		Title:       model.Title,
		Description: model.Description,
		AssigneeID:  model.AssigneeID,
		ProjectID:   model.ProjectID,
		CreatedByID: model.CreatedByID,
	}
	res := db.Ctx.Create(task)
	if res.Error != nil {
		return res.Error
	}
	return c.JSON(task)
}
