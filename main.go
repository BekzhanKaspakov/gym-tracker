package main

import (
	"gym-tracker/database"
	"gym-tracker/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()

	r := gin.Default()
	routes.RegisterWorkoutRoutes(r)

	r.Run(":8080")
}
