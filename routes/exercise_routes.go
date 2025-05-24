package routes

import (
	"gym-tracker/controllers"
	"gym-tracker/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterExerciseRoutes(r *gin.Engine) {
	workoutRoutes := r.Group("/api/exercises", middleware.AuthMiddleware())
	{
		workoutRoutes.POST("/add", controllers.CreateExercise)
		workoutRoutes.GET("/", controllers.GetAllExercises)
	}
}
