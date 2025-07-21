package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MongoURI string
	Port     string
}

var AppConfig Config

func LoadConfig() {
	_ = godotenv.Load() // ignore errors for local dev

	AppConfig = Config{
		MongoURI: getEnv("MONGO_URI", "mongodb://localhost:27017"),
		Port:     getEnv("PORT", "8080"),
	}
}

func getEnv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}
