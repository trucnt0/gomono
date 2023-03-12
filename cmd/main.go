package main

import (
	"log"

	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/gofiber/fiber/v2"
	"github.com/trucnt0/gomono/api"
	"github.com/trucnt0/gomono/config"
	"github.com/trucnt0/gomono/internal/app"
	"github.com/trucnt0/gomono/internal/domain"
	"github.com/trucnt0/gomono/internal/repository"
	"github.com/trucnt0/gomono/pkg/db"

	jwt "github.com/gofiber/jwt/v3"
)

func main() {
	server := fiber.New()
	server.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, https://gomono.vercel.app",
	}))

	config.LoadEnv()
	err := db.Connect()
	db.Ctx.AutoMigrate(&domain.User{}, &domain.Project{})
	if err != nil {
		log.Fatal("Unable to connect database")
	}

	//TODO: DI using Wire
	//https://github.com/google/wire/blob/main/README.md
	userRepo := repository.NewUserRepository(db.Ctx)
	service := app.NewUserService(userRepo)
	userHandler := api.NewUserHandler(service)

	// Auth
	server.Post("/api/register", userHandler.Register)
	server.Post("/api/login", userHandler.Login)

	// JWT middleware
	// Keep this on top to protect below APIs
	server.Use(jwt.New(jwt.Config{
		SigningKey: []byte(config.Env.SecretKey),
	}))

	// Protected APIs

	// Users
	server.Post("api/users", userHandler.Create)
	server.Get("api/users", userHandler.GetAll)
	server.Delete("api/users/:id", userHandler.Delete)

	// Leads
	server.Get("/api/leads", api.GetLeads)

	// Projects
	server.Get("/api/projects", api.GetProjects)
	server.Post("/api/projects", api.CreateProject)
	server.Put("/api/projects/:id", api.UpdateProject)
	server.Delete("/api/projects/:id", api.DeleteProject)

	// Reports
	server.Get("/api/reports/project-count-by-lead", api.GetProjectCountByLead)
	server.Get("/api/reports/stats", api.GetStats)

	log.Fatal(server.Listen(":3001"))
}
