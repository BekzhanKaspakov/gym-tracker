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
	parsedDate, err := time.Parse(time.RFC3339, workoutReq.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD."})
		return
	}

	workout := models.Workout{ID: workoutId, UserID: *userId, ExerciseID: workoutReq.ExerciseID, Date: parsedDate, Sets: workoutReq.Sets}
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

func DeleteWorkout(c *gin.Context) {
	workoutId := c.Param("id")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userId, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	workout, err := utils.FindUserOwnedWorkoutByID(workoutId, *userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	filter := bson.M{"_id": workout.ID, "userId": workout.UserID}
	_, err = database.WorkoutCollection.DeleteOne(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete workout"})
		return
	}
	c.JSON(http.StatusOK, nil)
}

func GetAllWorkouts(c *gin.Context) {
	date := c.Query("date")

	filter := bson.M{}
	if date != "" {
		parsedDate, err := time.Parse("2006-01-02", date)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD."})
			return
		}

		start := parsedDate
		end := parsedDate.Add(24 * time.Hour)

		filter["date"] = bson.M{
			"$gte": start,
			"$lt":  end,
		}
	}

	cursor, err := database.WorkoutCollection.Find(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch workouts"})
		return
	}
	defer cursor.Close(c)

	var rawWorkouts []models.Workout
	if err := cursor.All(c, &rawWorkouts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse workouts"})
		return
	}

	var workoutsWithExercises []models.WorkoutWithExercise
	for _, workout := range rawWorkouts {
		// Convert ExerciseID string to ObjectID
		exerciseObjID, err := primitive.ObjectIDFromHex(workout.ExerciseID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid exercise ID in workout"})
			return
		}

		var exercise models.Exercise
		err = database.ExerciseCollection.FindOne(c, bson.M{"_id": exerciseObjID}).Decode(&exercise)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exercise for workout"})
			return
		}

		workoutWithExercise := models.WorkoutWithExercise{
			ID:       workout.ID,
			UserID:   workout.UserID,
			Exercise: exercise,
			Date:     workout.Date,
			Sets:     workout.Sets,
		}

		workoutsWithExercises = append(workoutsWithExercises, workoutWithExercise)
	}

	c.JSON(http.StatusOK, workoutsWithExercises)
}

func WorkoutsMonthlySummary(c *gin.Context) {
	date := c.Query("date")

	filter := bson.M{}
	if date != "" {
		parsedDate, err := time.Parse("2006-01-02", date)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD."})
			return
		}

		firstOfMonth := time.Date(parsedDate.Year(), parsedDate.Month(), 1, 0, 0, 0, 0, parsedDate.Location())
		lastOfMonth := firstOfMonth.AddDate(0, 1, 0)

		filter["date"] = bson.M{
			"$gte": firstOfMonth,
			"$lt":  lastOfMonth,
		}
	}

	cursor, err := database.WorkoutCollection.Find(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch workouts"})
		return
	}
	defer cursor.Close(c)

	var rawWorkouts []models.Workout
	if err := cursor.All(c, &rawWorkouts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse workouts"})
		return
	}

	var workoutsSummary models.Month = make(map[int]bool)

	for _, w := range rawWorkouts {
		_, _, day := w.Date.Date()
		workoutsSummary[day] = true
	}

	c.JSON(http.StatusOK, workoutsSummary)
}
