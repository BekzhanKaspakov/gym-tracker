package routes

import (
	"gym-tracker/controllers"
	"gym-tracker/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterExerciseRoutes(r *gin.Engine) {
	exerciseRoutes := r.Group("/api/exercises", middleware.AuthMiddleware())
	{
		exerciseRoutes.POST("/add", controllers.AddExercise)
		exerciseRoutes.PATCH("/:id", controllers.EditExercise)
		exerciseRoutes.GET("/categories", controllers.GetCategories)
		exerciseRoutes.GET("/", controllers.GetAllExercises)
	}
}
