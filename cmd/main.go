package main

import (
	"log"

	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/config"
	"github.com/trucnt0/gomono/internal/handler"
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
	if err != nil {
		log.Fatal("Unable to connect database")
	}

	// Auth
	app.Post("/api/register", handler.RegisterAccount)
	app.Post("/api/login", handler.Login)

	// JWT middleware
	// Keep this on top to protect below APIs
	app.Use(jwt.New(jwt.Config{
		SigningKey: []byte(config.Env.SecretKey),
	}))

	// Protected APIs
	// Tasks
	app.Get("/api/tasks", handler.GetTasks)

	// Leads
	app.Get("/api/leads", handler.GetLeads)

	// Projects
	app.Get("/api/projects", handler.GetProjects)
	app.Post("/api/projects", handler.CreateProject)
	app.Put("/api/projects/:id", handler.UpdateProject)
	app.Delete("/api/projects/:id", handler.DeleteProject)

	// Users
	app.Post("api/users", handler.CreateUser)
	app.Get("api/users", handler.GetUsers)
	app.Delete("api/users/:id", handler.DeleteUser)

	// Roles
	app.Get("/api/roles", handler.GetRoles)
	app.Post("/api/roles", handler.CreateRole)

	// Reports
	app.Get("/api/reports/project-count-by-lead", handler.GetProjectCountByLead)

	log.Fatal(app.Listen(":3001"))
}
