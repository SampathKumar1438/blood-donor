#!/bin/bash

echo "==================================="
echo "Blood Donor Application Setup"
echo "==================================="
echo

echo "This script will set up the Blood Donor application for you."
echo "It will install all the required dependencies for both"
echo "the frontend and the backend."
echo
echo "Press Enter to continue or Ctrl+C to abort."
read

echo
echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/ and try again."
    exit 1
fi

echo
echo "Checking for Python..."
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed or not in PATH."
    echo "Please install Python from https://www.python.org/downloads/ and try again."
    exit 1
fi

echo
echo "Installing backend dependencies..."
cd "$(dirname "$0")/backend"
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies."
    exit 1
fi

echo
echo "Installing frontend dependencies..."
cd "$(dirname "$0")/frontend"
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies."
    exit 1
fi

echo
echo "==================================="
echo "Setup completed successfully!"
echo "==================================="
echo
echo "You can now run the application using:"
echo "  ./start-app.sh"
echo
echo "Press Enter to exit..."
read
