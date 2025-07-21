package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Workout struct {
	ID         primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	UserID     primitive.ObjectID `json:"userId" bson:"userId"`
	ExerciseID string             `json:"exerciseId" bson:"exerciseId"`
	Date       time.Time          `json:"date" bson:"date"` // ISO 8601 format
	Sets       [][2]float64       `json:"sets" bson:"sets"` // [weight, reps] tuples
}

type WorkoutWithExercise struct {
	ID       primitive.ObjectID `json:"id,omitempty"`
	UserID   primitive.ObjectID `json:"userId"`
	Exercise Exercise           `json:"exercise"` // full exercise info
	Date     time.Time          `json:"date"`
	Sets     [][2]float64       `json:"sets"`
}

type Month map[int]bool
