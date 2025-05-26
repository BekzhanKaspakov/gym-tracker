package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Workout struct {
	ID         primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	UserID     primitive.ObjectID `json:"userId" bson:"userId"`
	ExerciseID string             `json:"exerciseId" bson:"exerciseId"`
	Date       string             `json:"date" bson:"date"` // ISO 8601 format
	Sets       [][2]float64       `json:"sets" bson:"sets"` // [weight, reps] tuples
}
