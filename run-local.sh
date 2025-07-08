#!/bin/bash

# run-local.sh - Script to run the candidates application in LOCAL mode
# This script configures:
# 1. In-memory database (no PostgreSQL)
# 2. Local file storage (no S3)
# 3. Disabled monitoring features

echo "🚀 Starting Candidates Application in LOCAL mode..."
echo "📝 Configuration:"
echo "   - Database: In-memory"
echo "   - File Storage: Local filesystem"
echo "   - Monitoring: Disabled"
echo ""

# Set environment variables for LOCAL mode
export NODE_ENV=development
export DATABASE_TYPE=memory
export FILE_STORAGE_TYPE=local
export MONITORING_ENABLED=false

# Backend configuration
export PORT=3000
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USER=candidates_user
export DATABASE_PASSWORD=candidates_password
export DATABASE_NAME=candidates

# Frontend configuration
export ANGULAR_PORT=4200

# Create necessary directories for local file storage
mkdir -p ./local-storage/uploads
mkdir -p ./local-storage/files

echo "🔧 Environment variables set:"
echo "   NODE_ENV=$NODE_ENV"
echo "   DATABASE_TYPE=$DATABASE_TYPE"
echo "   FILE_STORAGE_TYPE=$FILE_STORAGE_TYPE"
echo "   MONITORING_ENABLED=$MONITORING_ENABLED"
echo ""

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🔴 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "🏗️  Building and starting backend..."
cd candidates-app

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building backend..."
npm run build

# Start backend in background
echo "🟢 Starting backend on port $PORT..."
node dist/src/main.js &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend started successfully (PID: $BACKEND_PID)"
else
    echo "❌ Backend failed to start"
    exit 1
fi

echo ""
echo "🏗️  Building and starting frontend..."
cd ../candidates-webapp

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
echo "🟢 Starting frontend on port $ANGULAR_PORT..."
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend started successfully (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 APPLICATION READY!"
echo "======================================"
echo "📱 Frontend: http://localhost:$ANGULAR_PORT"
echo "🔗 Backend API: http://localhost:$PORT"
echo "🏥 Health Check: http://localhost:$PORT/health"
echo "======================================"
echo ""
echo "💡 Tips:"
echo "   - Upload Excel files with format: Seniority | Years | Availability"
echo "   - Files are stored in ./local-storage/"
echo "   - Database is in-memory (data will be lost on restart)"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for user to stop the services
wait