package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Exercise struct {
	ID               primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	UserID           primitive.ObjectID `json:"userId" bson:"userId"`
	ExerciseCategory string             `json:"exerciseCategory" bson:"exerciseCategory"`
	Label            string             `json:"label" bson:"label"`
}
