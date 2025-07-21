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

func FindUserOwnedExerciseByID(idStr string, userId primitive.ObjectID) (*models.Exercise, error) {
	objID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		return nil, errors.New("invalid exercise ID")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var exercise models.Exercise
	filter := bson.M{"_id": objID, "userId": userId}
	err = database.ExerciseCollection.FindOne(ctx, filter).Decode(&exercise)
	if err != nil {
		return nil, errors.New("exercise not found or not owned by user")
	}

	return &exercise, nil
}
