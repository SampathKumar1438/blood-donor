# Deploying Blood Donor App on Render

This guide will help you deploy the Blood Donor application to Render.com as two separate services: a backend API and a frontend web app.

## Option 1: Deploying with Blueprint (Recommended)

The simplest way to deploy both services is using the included `render.yaml` blueprint:

1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and create both services
6. Review the settings and click "Apply"
7. **Important**: The backend URL will automatically be passed to the frontend using Render's built-in service discovery

## Option 2: Manual Deployment

If you prefer manual deployment, follow these steps:

### Backend Deployment (Flask API)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `blood-donor-backend`
   - **Environment**: `Python`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your preferred branch)
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Environment Variables**:
     - `FLASK_ENV`: `production`
     - `SECRET_KEY`: Generate a random string
     - `PYTHONUNBUFFERED`: `true`
4. Click "Create Web Service"
5. Note the URL provided (e.g., `https://blood-donor-backend.onrender.com`)

### Frontend Deployment (React/Vite)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `blood-donor-frontend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your preferred branch)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && node server.js`
   - **Environment Variables**:
     - `VITE_API_URL`: URL of your backend service (e.g., `https://blood-donor-backend.onrender.com`)
     - `NODE_VERSION`: `18.x`
4. Click "Create Web Service"

## Important Notes

1. **Database Persistence**: The SQLite database used in development will be ephemeral on Render's free tier. Consider migrating to PostgreSQL for a production deployment using Render's managed database service.

2. **CORS Configuration**: The backend is already configured to accept requests from any origin, which will work with the deployed frontend.

3. **Environment Variables**: Make sure to update the `VITE_API_URL` to match your deployed backend URL.

4. **Troubleshooting**: If you encounter issues, check the service logs in the Render dashboard.

## Verifying Deployment

1. Wait for both services to finish deploying
2. Access your frontend URL (e.g., `https://blood-donor-frontend.onrender.com`)
3. Try registering a new user and logging in
4. Verify that donor search and map features work properly

## Post-Deployment

After successful deployment, you may want to:

1. Set up a custom domain name
2. Configure automatic HTTPS with Render
3. Set up database backups if you've migrated to PostgreSQL
4. Configure monitoring and alerts
