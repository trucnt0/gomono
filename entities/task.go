package entities

import "gorm.io/gorm"

type Task struct {
	gorm.Model
	Title       string
	Description string
	AssigneeID  int
	Assignee    User
	CreatedByID int
	CreatedBy   User
	ProjectID   int
	Project     Project
}
