package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client
var WorkoutCollection *mongo.Collection
var ExerciseCollection *mongo.Collection

func ConnectDB(uri string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Mongo connection failed:", err)
	}

	MongoClient = client
	WorkoutCollection = client.Database("gymTracker").Collection("workouts")
	WorkoutCollection = client.Database("gymTracker").Collection("exercises")

	fmt.Println("✅ MongoDB Connected")
}
