package utils

import (
	"errors"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetUserID(c *gin.Context) (*primitive.ObjectID, error) {
	userId, ok := c.Get("userId")
	if !ok {
		return nil, fmt.Errorf("userId not found in context")
	}
	idStr, ok := userId.(string)
	if !ok {
		return nil, fmt.Errorf("userId is not a string")
	}
	userId, err := primitive.ObjectIDFromHex(idStr)
	assertedUserId, ok := userId.(primitive.ObjectID)

	if err != nil || !ok {
		return nil, errors.New("invalid user ID")
	}
	return &assertedUserId, nil
}
