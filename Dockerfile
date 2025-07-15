# Use Golang base image
FROM golang:1.23-alpine

# Create working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the app
COPY . .

# Build the Go app
RUN go build -o server .

# Expose the port
EXPOSE 8080

# Start the server
CMD ["./server"]
