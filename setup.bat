@echo off
echo ===================================
echo Blood Donor Application Setup
echo ===================================
echo.

echo This script will set up the Blood Donor application for you.
echo It will install all the required dependencies for both
echo the frontend and the backend.
echo.
echo Press any key to continue or Ctrl+C to abort.
pause > nul

echo.
echo Checking for Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    exit /b 1
)

echo.
echo Checking for Python...
python --version 2>nul
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/downloads/ and try again.
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd %~dp0backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies.
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd %~dp0frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies.
    exit /b 1
)

echo.
echo ===================================
echo Setup completed successfully!
echo ===================================
echo.
echo You can now run the application using:
echo   start-app.bat
echo.
echo Press any key to exit...
pause > nul
