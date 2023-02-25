package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID          uuid.UUID `json:"id"`
	CreatedDate time.Time `json:"createdDate"`
	UpdatedDate time.Time `json:"updatedDate"`
}

func (base *Base) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	base.CreatedDate = time.Now().UTC()
	base.UpdatedDate = time.Now().UTC()
	return
}

func (base *Base) BeforeUpdate(tx *gorm.DB) (err error) {
	base.UpdatedDate = time.Now().UTC()
	return
}
