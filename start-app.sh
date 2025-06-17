#!/bin/bash

echo "==================================="
echo "Blood Donor Application Launcher"
echo "==================================="
echo

echo "Starting the application..."
echo

cd frontend

# Start backend in background
./start_backend.sh &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "Application started successfully!"
echo
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop the application"

# Handle cleanup on exit
function cleanup {
  echo "Stopping services..."
  kill $BACKEND_PID $FRONTEND_PID
  wait
  echo "Services stopped."
}

trap cleanup EXIT

# Wait for key press
wait
