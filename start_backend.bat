@echo off
echo ===================================
echo Blood Donor Backend Starter
echo ===================================
echo.

echo Checking for Python...
python --version 2>nul
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python and try again.
    exit /b 1
)

echo.
echo Installing dependencies...
cd %~dp0backend
pip install -r requirements.txt

echo.
echo Starting Flask backend...
python app.py

pause
