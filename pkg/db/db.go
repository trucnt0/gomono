package db

import (
	"github.com/trucnt0/gomono/config"
	"github.com/trucnt0/gomono/internal/entity"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Ctx *gorm.DB

func Connect() error {

	var err error
	Ctx, err = gorm.Open(mysql.Open(config.Env.DatabaseUrl), &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
	})

	if err != nil {
		panic(err)
	}

	// Migration
	Ctx.AutoMigrate(&entity.User{}, &entity.Task{}, &entity.Project{}, &entity.Role{})

	return nil
}
