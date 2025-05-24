package main

import (
	"gym-tracker/config"
	"gym-tracker/database"
	"gym-tracker/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()
	database.ConnectDB(config.AppConfig.MongoURI)

	r := gin.Default()
	routes.RegisterAuthRoutes(r)
	routes.RegisterWorkoutRoutes(r)
	routes.RegisterExerciseRoutes(r)

	r.Run(":" + config.AppConfig.Port)
}
