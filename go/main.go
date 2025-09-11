package main

import (
	"gym-tracker/config"
	"gym-tracker/database"
	"gym-tracker/routes"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()
	database.ConnectDB(config.AppConfig.MongoURI)

	r := gin.Default()
	// - No origin allowed by default
	// - GET,POST, PUT, HEAD methods
	// - Credentials share disabled
	// - Preflight requests cached for 12 hours
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	routes.RegisterAuthRoutes(r)
	routes.RegisterWorkoutRoutes(r)
	routes.RegisterExerciseRoutes(r)

	r.Run(":" + config.AppConfig.Port)
}
