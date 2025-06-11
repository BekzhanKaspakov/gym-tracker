package routes

import (
	"gym-tracker/controllers"
	"gym-tracker/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterWorkoutRoutes(r *gin.Engine) {
	workoutRoutes := r.Group("/api/workouts", middleware.AuthMiddleware())
	{
		workoutRoutes.POST("/add", controllers.AddWorkout)
		workoutRoutes.PATCH("/:id", controllers.EditWorkout)
		workoutRoutes.GET("/summary", controllers.WorkoutsMonthlySummary)
		workoutRoutes.GET("", controllers.GetAllWorkouts)
	}
}
