package db

import (
	"github.com/google/uuid"
	"github.com/trucnt0/gomono/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Ctx *gorm.DB

type ID uuid.UUID

func Connect() error {
	var err error
	Ctx, err = gorm.Open(mysql.Open(config.Env.DatabaseUrl), &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
	})

	if err != nil {
		panic(err)
	}

	return nil
}
