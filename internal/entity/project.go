package entity

import "github.com/google/uuid"

type Project struct {
	Base
	Name        string    `json:"name"`
	Description string    `json:"description"`
	IsActive    bool      `json:"isActive"`
	LeadID      uuid.UUID `json:"leadID"`
	Lead        User      `json:"lead"`
	Tasks       []Task    `json:"tasks"`
}
