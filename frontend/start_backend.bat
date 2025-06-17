@echo off
echo Installing Python backend dependencies...
cd backend
pip install -r requirements.txt

echo Starting Flask server...
python app.py
