package utils

import (
	"context"
	"errors"
	"gym-tracker/database"
	"gym-tracker/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func FindUserOwnedWorkoutByID(idStr string, userId primitive.ObjectID) (*models.Workout, error) {
	objID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		return nil, errors.New("invalid workout ID")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var workout models.Workout
	filter := bson.M{"_id": objID, "userId": userId}
	err = database.WorkoutCollection.FindOne(ctx, filter).Decode(&workout)
	if err != nil {
		return nil, errors.New("Workout not found or not owned by user")
	}

	return &workout, nil
}
