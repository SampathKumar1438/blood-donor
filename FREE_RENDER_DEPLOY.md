# Deploying Blood Donor App on Render Free Tier

This guide will walk you through deploying the Blood Donor application on Render's free tier.

## Understanding Render's Free Tier Limitations

Before we start, it's important to understand Render's free tier limitations:

- **Free web services** sleep after 15 minutes of inactivity
- Services will **wake up** when receiving a new request (might take 30-60 seconds)
- Free tier is limited to **750 hours per month** across all services
- Each service gets a **subdomain** on `onrender.com`
- Static sites remain **always on** and don't count toward hours

## Deployment Strategy for Free Tier

For optimal free tier usage, we'll deploy:
1. Backend: As a free web service (will sleep after inactivity)
2. Frontend: As a static site (always available)

## Step 1: Deploy the Backend API

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** > **Web Service**
3. Connect your GitHub repository
4. Configure your service:
   - **Name**: `blood-donor-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Instance Type**: `Free`
   - **Environment Variables**:
     - `FLASK_ENV`: `production`
     - `SECRET_KEY`: (generate a random string)
     - `PYTHONUNBUFFERED`: `true`
5. Click **Create Web Service**
6. Note down the service URL (e.g., `https://blood-donor-backend.onrender.com`)

## Step 2: Deploy the Frontend as a Static Site

1. First, modify `vite.config.js` to build with the correct backend URL:

```javascript
// In frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000'),
  }
})
```

2. Build the frontend locally with your backend URL:

```bash
cd frontend
VITE_API_URL=https://blood-donor-backend.onrender.com npm run build
```

3. In the Render Dashboard, click **New** > **Static Site**
4. Connect your GitHub repository
5. Configure your static site:
   - **Name**: `blood-donor-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Your backend URL (e.g., `https://blood-donor-backend.onrender.com`)
6. Click **Create Static Site**

## Step 3: Configure CORS (Already Done)

You've already configured CORS in your backend to accept requests from any origin, so this should work without further changes.

## Important Note About SQLite on Free Tier

On Render's free tier, the filesystem is **ephemeral**, meaning any data stored in SQLite will be lost when the service restarts or spins down due to inactivity. For a production app, consider:

1. **For testing/demo only**: Continue using SQLite, but understand data will reset periodically
2. **For production data**: Upgrade to a paid tier and use Render's PostgreSQL database service

## Accessing Your Deployed Application

Once deployment is complete:

- Frontend: Access via `https://blood-donor-frontend.onrender.com`
- Backend API: `https://blood-donor-backend.onrender.com`

Remember that when accessing the app after a period of inactivity, the backend may take 30-60 seconds to spin up on the first request.

## Monitoring Usage

Monitor your free tier usage in the Render Dashboard to ensure you don't exceed the 750 hours per month limit. If you're approaching this limit, consider:

1. Combining services
2. Upgrading to a paid plan
3. Implementing more aggressive sleep policies

## Testing the Deployment

1. Access your frontend URL
2. Try to register a new user
3. Test the donor search functionality
4. Be patient on the first request as the backend spins up

## Troubleshooting

If you encounter issues:
1. Check service logs in the Render Dashboard
2. Verify environment variables are set correctly
3. Ensure CORS is configured properly
4. Check browser console for any API errors
