# 🏋️‍♂️ Gym Tracker – Full Stack (Go + Next.js)

A full-stack fitness tracking app with a **Next.js frontend** and a **Go REST API backend**, powered by **MongoDB**. This project supports managing workouts, exercises, and user logs — ideal for fitness platforms or personal training tools.

---

## 🚀 Features

- ✅ **Track workouts, exercises, and performance logs**
- ✅ **Next.js frontend** (React 18 with SSR/CSR)
- ✅ **Go REST API** backend
- ✅ **MongoDB** for data storage
- ✅ **Docker Compose** setup for all services
- ✅ Mobile-friendly & ready for API integration

---

## ⚙️ Prerequisites

- Go 1.23
- Node.js 18+ (if not using Docker)
- Docker & Docker Compose
- [Optional] Postman or curl for API testing

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourname/gym-tracker-fullstack.git
cd gym-tracker-fullstack
```

### 2. Set up environment variables

Create a .env file in the root directory:

#### Backend API

PORT=8080
MONGO_URI=mongodb://mongo:27017

#### Frontend (if needed)

NEXT_PUBLIC_API_URL=http://localhost:8080

### 3. Run Locally (without Docker)

#### 🖥 Backend (Go)

```bash
cd backend
go mod tidy
go run main.go
```

#### 🌐 Frontend (Next.js)

```bash
cd frontend
pnpm install
pnpm dev
```

    Frontend: http://localhost:3000

    API: http://localhost:8080

### 4. Or Run Everything with Docker Compose

From the root directory:

docker compose up --build

    Frontend: http://localhost

    Backend API: http://localhost:8080

    MongoDB: localhost:27017
