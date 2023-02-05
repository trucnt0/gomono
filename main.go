package main

import (
	"log"

	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/database"
	"github.com/trucnt0/gomono/handlers"
	"github.com/trucnt0/gomono/utils"

	jwt "github.com/gofiber/jwt/v3"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, https://gomono.vercel.app",
	}))

	utils.LoadEnv()
	err := database.Connect()
	if err != nil {
		log.Fatal("Unable to connect database")
	}

	// Auth
	app.Post("/api/register", handlers.RegisterAccount)
	app.Post("/api/login", handlers.Login)

	// JWT middleware
	// Keep this on top to protect below APIs
	app.Use(jwt.New(jwt.Config{
		SigningKey: []byte(utils.Env.SecretKey),
	}))

	// Protected APIs

	// Tasks
	app.Get("/api/tasks", handlers.GetTasks)

	// Leads
	app.Get("/api/leads", handlers.GetLeads)

	// Projects
	app.Get("/api/projects", handlers.GetProjects)
	app.Post("/api/projects", handlers.CreateProject)

	// Users
	app.Get("api/users", handlers.GetUsers)
	app.Delete("api/users/:id", handlers.DeleteUser)

	log.Fatal(app.Listen(":3001"))
}
