#!/bin/bash

# Productify Development Startup Script
# This script helps you start both the backend and frontend for development

echo "🚀 Starting Productify Development Environment"
echo "=============================================="

# Check if backend directory exists
if [ ! -d "../backend/crud-api" ]; then
    echo "❌ Backend directory not found. Please ensure the backend is in ../backend/crud-api"
    exit 1
fi

# Check if backend is already running
if curl -s http://localhost:3000/products > /dev/null 2>&1; then
    echo "✅ Backend is already running on http://localhost:3000"
else
    echo "🔄 Starting backend..."
    cd ../backend/crud-api
    npm start &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    cd ../../frontend/productify-frontend
    
    # Wait for backend to be ready
    echo "⏳ Waiting for backend to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:3000/products > /dev/null 2>&1; then
            echo "✅ Backend is ready!"
            break
        fi
        sleep 1
    done
fi

echo ""
echo "🔄 Starting frontend..."
echo "Frontend will be available at: http://localhost:4200"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start frontend
npm start
