# Blood Donor Network

A modern full-stack web application to connect blood donors with those in need, built with React frontend and Flask backend.

## Features

- **User Registration & Authentication**: Create an account and sign in securely with JWT authentication
- **Donor Registration**: Register as a blood donor and manage your donor profile
- **Donor Map**: Interactive map showing available blood donors in your area
- **Responsive Design**: Fully optimized for all devices with modern UI elements
- **Modern UI**: Built with Material UI and Tailwind CSS
- **Backend API**: RESTful API built with Flask
- **Database**: SQLite for data storage

## Technologies Used

### Frontend
- React 18
- React Router
- Material UI
- Tailwind CSS
- React Hook Form
- React Leaflet (for maps)
- Axios (for API calls)
- JWT authentication

### Backend
- Python
- Flask
- SQLAlchemy
- SQLite
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn
- pip

### Installation & Running the App

#### Easy Method (Windows)

1. Clone the repository
2. Simply run the `start-app.bat` script:
   ```
   start-app.bat
   ```
   This will automatically:
   - Install all frontend and backend dependencies
   - Start the Flask backend server
   - Start the React development server
   - Open necessary terminal windows
   - Provide URLs to access the application

#### Manual Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

#### Start the Backend Server
Option 1: Using script (Windows)
```
.\start_backend.bat
```

Option 2: Using script (Linux/Mac)
```
chmod +x start_backend.sh
./start_backend.sh
```

Option 3: Manually
```
cd backend
python app.py
```

#### Start the Frontend Server
```
npm run dev
```

5. Access the application:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable UI components  
├── context/        # React context for state management
├── hooks/          # Custom React hooks
├── pages/          # Application pages/views
├── services/       # API services
└── utils/          # Utility functions and constants
```

## Future Improvements

- Add backend API integration
- Implement JWT authentication
- Add blood request functionality
- Enable real-time notifications
- Add admin dashboard

## License

MIT
