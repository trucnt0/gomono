package entities

type Role struct {
	Base
	Name        string `json:"name"`
	Description string `json:"description"`
}
