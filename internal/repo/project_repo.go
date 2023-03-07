package repo

import (
	"github.com/trucnt0/gomono/internal/entity"
	"github.com/trucnt0/gomono/pkg/database"
)

func GetProjectByID(projectID int) *entity.Project {
	project := new(entity.Project)
	database.Ctx.First(&project, projectID)
	return project
}
