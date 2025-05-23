package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Workout struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	UserID   string             `json:"userId" bson:"userId"`
	Exercise string             `json:"exercise" bson:"exercise"`
	Sets     int                `json:"sets" bson:"sets"`
	Reps     int                `json:"reps" bson:"reps"`
	Date     string             `json:"date" bson:"date"` // ISO 8601 format
}
