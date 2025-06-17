@echo off
color 0A
cls
echo ===================================================
echo        BLOOD DONOR APPLICATION STARTER
echo ===================================================
echo.

:: Check if Python is installed
python --version > nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python and try again.
    echo.
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js and try again.
    echo.
    pause
    exit /b 1
)

echo 1. Installing backend dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Failed to install Python dependencies.
    echo.
    pause
    exit /b 1
)
cd ..

echo.
echo 2. Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Failed to install Node.js dependencies.
    echo.
    pause
    exit /b 1
)

echo.
echo 3. Starting backend server...
start "Blood Donor Backend" cmd /c "color 0B && cd backend && python app.py"

:: Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 > nul

echo.
echo 4. Starting frontend development server...
start "Blood Donor Frontend" cmd /c "color 09 && npm run dev"

echo.
echo ===================================================
echo Blood Donor Application started successfully!
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo You can now open your browser and navigate to:
echo http://localhost:5173
echo ===================================================
echo.
echo Press any key to close this window...
pause > nul
