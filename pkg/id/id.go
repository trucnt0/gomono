package id

import "github.com/google/uuid"

func FromString(id string) uuid.UUID {
	return uuid.MustParse(id)
}
