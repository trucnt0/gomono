package repo

import (
	"github.com/trucnt0/gomono/internal/entity"
	"github.com/trucnt0/gomono/pkg/db"
)

func GetProjectByID(projectID int) *entity.Project {
	project := new(entity.Project)
	db.Ctx.First(&project, projectID)
	return project
}
