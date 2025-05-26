package controllers

import (
	"context"
	"net/http"
	"time"

	"gym-tracker/database"
	"gym-tracker/models"
	"gym-tracker/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddWorkout(c *gin.Context) {
	var workoutReq struct {
		Date       string       `json:"date" binding:"required"`
		Sets       [][2]float64 `json:"sets" binding:"required"`
		ExerciseID string       `json:"exerciseId" bson:"exerciseId"`
	}
	if err := c.ShouldBindJSON(&workoutReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
		return
	}

	workoutId := primitive.NewObjectID()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userId, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = utils.FindUserOwnedExerciseByID(workoutReq.ExerciseID, *userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	workout := models.Workout{ID: workoutId, UserID: *userId, ExerciseID: workoutReq.ExerciseID, Date: workoutReq.Date, Sets: workoutReq.Sets}
	_, err = database.WorkoutCollection.InsertOne(ctx, workout)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert workout"})
		return
	}
	c.JSON(http.StatusOK, workout)
}

func EditWorkout(c *gin.Context) {
	workoutId := c.Param("id")
	var workoutReq struct {
		Date       string       `json:"date" binding:"required"`
		ExerciseID string       `json:"exerciseId" bson:"exerciseId"`
		Sets       [][2]float64 `json:"sets" binding:"required"`
	}
	if err := c.ShouldBindJSON(&workoutReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userId, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = utils.FindUserOwnedExerciseByID(workoutReq.ExerciseID, *userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	workout, err := utils.FindUserOwnedWorkoutByID(workoutId, *userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	update := bson.M{"$set": bson.M{"sets": workoutReq.Sets, "date": workoutReq.Date}}
	filter := bson.M{"_id": workout.ID, "userId": workout.UserID}
	_, err = database.WorkoutCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert workout"})
		return
	}
	c.JSON(http.StatusOK, update)
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
