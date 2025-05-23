package routes

import (
	"gym-tracker/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterWorkoutRoutes(r *gin.Engine) {
	workoutRoutes := r.Group("/api/workouts")
	{
		workoutRoutes.POST("/", controllers.CreateWorkout)
		workoutRoutes.GET("/", controllers.GetAllWorkouts)
	}
}
