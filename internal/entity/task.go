package entity

type Task struct {
	Base
	Title       string  `json:"title"`
	Description string  `json:"description"`
	AssigneeID  int     `json:"assigneeID"`
	Assignee    User    `json:"assignee"`
	CreatedByID int     `json:"createdByID"`
	CreatedBy   User    `json:"createdBy"`
	ProjectID   int     `json:"projectID"`
	Project     Project `json:"project"`
}
