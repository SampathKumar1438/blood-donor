@echo off
echo Starting Blood Donor Application...

:: Start the backend in a new window
start "Blood Donor Backend" cmd /k "cd /d %~dp0 && start_backend.bat"

:: Wait for 3 seconds to give backend time to start
timeout /t 3 > nul

:: Start the frontend in a new window
start "Blood Donor Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo Both services have been started in separate windows.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
