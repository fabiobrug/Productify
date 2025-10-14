#!/bin/bash

echo "🔧 Productify Port Manager"
echo "========================="

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local processes=$(lsof -ti :$port)
    
    if [ -n "$processes" ]; then
        echo "Killing processes on port $port: $processes"
        kill -9 $processes
        echo "✅ Port $port is now free"
    else
        echo "ℹ️  Port $port is already free"
    fi
}

# Function to check if a port is in use
check_port() {
    local port=$1
    local processes=$(lsof -ti :$port)
    
    if [ -n "$processes" ]; then
        echo "❌ Port $port is in use by processes: $processes"
        return 1
    else
        echo "✅ Port $port is free"
        return 0
    fi
}

# Function to start services
start_services() {
    echo "Starting Productify services..."
    
    # Kill existing processes
    kill_port 3000
    kill_port 4200
    
    # Start backend
    echo "Starting backend on port 3000..."
    cd /home/fabiobrug/Projects/Productify/backend/crud-api
    npm run start:dev &
    BACKEND_PID=$!
    
    # Wait a bit for backend to start
    sleep 3
    
    # Start frontend
    echo "Starting frontend on port 4200..."
    cd /home/fabiobrug/Projects/Productify/frontend/productify-frontend
    npm start &
    FRONTEND_PID=$!
    
    echo "✅ Services started!"
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo ""
    echo "You can now access:"
    echo "Frontend: http://localhost:4200"
    echo "Backend API: http://localhost:3000"
}

# Function to stop services
stop_services() {
    echo "Stopping Productify services..."
    kill_port 3000
    kill_port 4200
    echo "✅ All services stopped"
}

# Function to show status
show_status() {
    echo "Productify Services Status:"
    echo "=========================="
    
    if check_port 3000; then
        echo "Backend: Not running"
    else
        echo "Backend: Running on port 3000"
    fi
    
    if check_port 4200; then
        echo "Frontend: Not running"
    else
        echo "Frontend: Running on port 4200"
    fi
}

# Main script logic
case "$1" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 2
        start_services
        ;;
    "status")
        show_status
        ;;
    "kill-4200")
        kill_port 4200
        ;;
    "kill-3000")
        kill_port 3000
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|kill-4200|kill-3000}"
        echo ""
        echo "Commands:"
        echo "  start     - Start both backend and frontend"
        echo "  stop      - Stop both backend and frontend"
        echo "  restart   - Restart both services"
        echo "  status    - Show status of services"
        echo "  kill-4200 - Kill processes on port 4200"
        echo "  kill-3000 - Kill processes on port 3000"
        echo ""
        echo "Examples:"
        echo "  $0 start      # Start both services"
        echo "  $0 kill-4200  # Free port 4200 for frontend"
        echo "  $0 status     # Check what's running"
        ;;
esac
