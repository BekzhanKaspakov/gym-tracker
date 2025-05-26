package controllers

import (
	"context"
	"net/http"
	"time"

	"gym-tracker/constants"
	"gym-tracker/database"
	"gym-tracker/models"
	"gym-tracker/utils"

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

func AddExercise(c *gin.Context) {
	var exercise models.Exercise
	if err := c.BindJSON(&exercise); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON: " + err.Error()})
		return
	}

	exercise.ID = primitive.NewObjectID()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	userId, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	exercise.UserID = *userId

	if !IsValidCategory(exercise.ExerciseCategory) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid exercise category"})
		return
	}

	_, err = database.ExerciseCollection.InsertOne(ctx, exercise)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert exercise"})
		return
	}
	c.JSON(http.StatusOK, exercise)
}

func EditExercise(c *gin.Context) {
	exerciseID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(exerciseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid exercise ID"})
		return
	}

	userId, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Only accept label field
	var req struct {
		Label string `json:"label" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Label is required"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Check ownership
	filter := bson.M{"_id": objID, "userId": userId}
	update := bson.M{"$set": bson.M{"label": req.Label}}

	result, err := database.ExerciseCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update exercise"})
		return
	}
	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exercise not found or not owned by user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Exercise label updated"})
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

func GetCategories(c *gin.Context) {
	c.JSON(http.StatusOK, constants.ExerciseCategories)
}
