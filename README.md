# 🏋️‍♂️ Gym Tracker – Go Server

A simple REST API server for tracking gym workouts, built in **Go** and powered by **MongoDB**. This project supports managing exercises, workouts, and user logs — ideal for fitness apps or personal training tools.

---

## 🚀 Features

- ✅ Track workouts, exercises, and performance logs
- ✅ Built with Go and MongoDB
- ✅ RESTful API design
- ✅ Dockerized for easy deployment
- ✅ Mobile-first integration ready

---

## 📁 Project Structure

go-gym-tracker/
├── main.go # Entry point for server
├── handlers/ # HTTP handler functions
├── models/ # Data models (Exercise, Workout, etc.)
├── routes/ # Route definitions
├── .env # Environment variables
├── Dockerfile # Docker build instructions
├── docker-compose.yml # Local container orchestration
└── README.md


---

## ⚙️ Prerequisites

- Go 1.23
- Docker & Docker Compose
- MongoDB (local or Atlas)
- [Optional] Postman or curl for API testing

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourname/go-gym-tracker.git
cd go-gym-tracker
```

### 2. Set up environment variables

Create a .env file:
PORT=8080
MONGO_URI=mongodb://mongo:27017

### 3. Run Locally

go mod tidy
go run main.go

### 4. Or Use Docker

docker-compose up --build

Your API will be available at:
👉 http://localhost:8080

