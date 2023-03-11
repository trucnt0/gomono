package main

import (
	"log"

	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/api"
	"github.com/trucnt0/gomono/config"
	"github.com/trucnt0/gomono/internal/models"
	"github.com/trucnt0/gomono/pkg/db"

	jwt "github.com/gofiber/jwt/v3"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, https://gomono.vercel.app",
	}))

	config.LoadEnv()
	err := db.Connect()
	db.Ctx.AutoMigrate(&models.User{}, &models.Project{})
	if err != nil {
		log.Fatal("Unable to connect database")
	}

	// Auth
	app.Post("/api/register", api.RegisterAccount)
	app.Post("/api/login", api.Login)

	// JWT middleware
	// Keep this on top to protect below APIs
	app.Use(jwt.New(jwt.Config{
		SigningKey: []byte(config.Env.SecretKey),
	}))

	// Protected APIs

	// Leads
	app.Get("/api/leads", api.GetLeads)

	// Projects
	app.Get("/api/projects", api.GetProjects)
	app.Post("/api/projects", api.CreateProject)
	app.Put("/api/projects/:id", api.UpdateProject)
	app.Delete("/api/projects/:id", api.DeleteProject)

	// Users
	app.Post("api/users", api.CreateUser)
	app.Get("api/users", api.GetUsers)
	app.Delete("api/users/:id", api.DeleteUser)

	// Reports
	app.Get("/api/reports/project-count-by-lead", api.GetProjectCountByLead)
	app.Get("/api/reports/stats", api.GetStats)

	log.Fatal(app.Listen(":3001"))
}
