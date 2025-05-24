package controllers

import (
	"context"
	"net/http"
	"time"

	"gym-tracker/database"
	"gym-tracker/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateWorkout(c *gin.Context) {
	var workout models.Workout
	if err := c.BindJSON(&workout); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	workout.ID = primitive.NewObjectID()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userId, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert exercise"})
		return
	}
	sUserId, ok := userId.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert exercise"})
		return
	}
	workout.UserID = sUserId

	_, err := database.WorkoutCollection.InsertOne(ctx, workout)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert workout"})
		return
	}
	c.JSON(http.StatusOK, workout)
}

func GetAllWorkouts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := database.WorkoutCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch workouts"})
		return
	}
	defer cursor.Close(ctx)

	var workouts []models.Workout
	if err = cursor.All(ctx, &workouts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse workouts"})
		return
	}

	c.JSON(http.StatusOK, workouts)
}
