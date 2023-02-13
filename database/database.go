package database

import (
	"github.com/trucnt0/gomono/entities"
	"github.com/trucnt0/gomono/utils"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Ctx *gorm.DB

func Connect() error {

	var err error
	Ctx, err = gorm.Open(mysql.Open(utils.Env.DatabaseUrl), &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
	})

	if err != nil {
		panic(err)
	}

	// Migration
	Ctx.AutoMigrate(&entities.User{}, &entities.Task{}, &entities.Project{}, &entities.Role{})

	return nil
}
