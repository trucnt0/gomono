package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (base *Base) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	base.CreatedAt = time.Now().UTC()
	return
}

func (base *Base) BeforeUpdate(tx *gorm.DB) (err error) {
	base.UpdatedAt = time.Now().UTC()
	return
}
