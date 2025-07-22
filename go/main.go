package main

import (
	"gym-tracker/config"
	"gym-tracker/database"
	"gym-tracker/routes"

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
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost", "http://localhost:3000"}
	corsConfig.AllowCredentials = true
	corsConfig.AllowHeaders = []string{"authorization", "content-type"}
	// trigger workflow

	r.Use(cors.New(corsConfig))
	routes.RegisterAuthRoutes(r)
	routes.RegisterWorkoutRoutes(r)
	routes.RegisterExerciseRoutes(r)

	r.Run(":" + config.AppConfig.Port)
}
