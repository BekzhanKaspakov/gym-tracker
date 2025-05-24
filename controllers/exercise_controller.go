package controllers

import (
	"context"
	"net/http"
	"time"

	"gym-tracker/constants"
	"gym-tracker/database"
	"gym-tracker/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func IsValidCategory(cat string) bool {
	for _, c := range constants.ExerciseCategories {
		if c == cat {
			return true
		}
	}
	return false
}

func CreateExercise(c *gin.Context) {
	var exercise models.Exercise
	if err := c.BindJSON(&exercise); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	exercise.ID = primitive.NewObjectID()
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
	exercise.UserID = sUserId

	if !IsValidCategory(exercise.ExerciseCategory) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert exercise"})
		return
	}

	_, err := database.ExerciseCollection.InsertOne(ctx, exercise)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert exercise"})
		return
	}
	c.JSON(http.StatusOK, exercise)
}

func GetAllExercises(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := database.ExerciseCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exercises"})
		return
	}
	defer cursor.Close(ctx)

	var exercises []models.Exercise
	if err = cursor.All(ctx, &exercises); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse exercises"})
		return
	}

	c.JSON(http.StatusOK, exercises)
}
