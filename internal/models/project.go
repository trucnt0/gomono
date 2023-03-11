package models

import (
	"github.com/google/uuid"
	"github.com/trucnt0/gomono/pkg/db"
)

type Project struct {
	Base
	Name        string    `json:"name"`
	Description string    `json:"description"`
	IsActive    bool      `json:"isActive"`
	LeadID      uuid.UUID `json:"leadID"`
	Lead        User      `json:"lead"`
}

func (p Project) GetByID(id uuid.UUID) *Project {
	result := new(Project)
	db.Ctx.First(&result, id)
	return result
}
