package entities

import "gorm.io/gorm"

type Project struct {
	gorm.Model
	Name        string
	Description string
	IsActive    bool
	LeadID      int
	Lead        User
	Tasks       []Task
}
