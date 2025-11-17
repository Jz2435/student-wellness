# Health Stress Application - Login Fix

## What Was Fixed

1. **Login Redirect Issue**: Added a small delay (100ms) after calling `login()` to ensure the authentication state is properly saved to `localStorage` before redirecting to the dashboard.

2. **Environment Configuration**: Created `.env.local` file to use `localhost:8001` instead of the hardcoded IP address for the backend.

## How to Run the Application

### 1. Start the Backend (FastAPI)

Open a terminal in WSL and navigate to the backend folder:

```bash
cd "/mnt/c/Users/A/Desktop/Health stress/backend"
```

Install Python dependencies (if not already installed):

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

The backend should now be running at `http://localhost:8001`

### 2. Start the Frontend (Next.js)

Open another terminal and navigate to the project root:

```bash
cd "/mnt/c/Users/A/Desktop/Health stress"
```

Install Node.js dependencies (if not already installed):

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

The frontend should now be running at `http://localhost:3001`

### 3. Test the Login

1. Open your browser and go to `http://localhost:3001`
2. If you don't have an account, click "Create account" to sign up
3. After signing up, you'll be automatically logged in and redirected to the dashboard
4. If you already have an account, enter your email and password and click "Sign In"
5. You should now be redirected to the dashboard page

## Troubleshooting

### Backend Connection Issues

If you see errors about not being able to connect to the backend:

1. Make sure the FastAPI backend is running on port 8001
2. Check the terminal where the backend is running for any error messages
3. Verify the `.env.local` file exists in the project root with:
   ```
   BACKEND_URL=http://localhost:8001
   ```

### Login Not Working

If login isn't working:

1. Check the browser console (F12) for any error messages
2. Verify the backend is running and accessible at `http://localhost:8001`
3. Test the backend API directly: Open `http://localhost:8001` in your browser - you should see `{"message":"FastAPI is running"}`
4. Clear your browser's localStorage:
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Click "Local Storage"
   - Click on `http://localhost:3001`
   - Click "Clear All"
   - Refresh the page and try logging in again

### Database Issues

If you need to reset the database:

1. Stop the FastAPI backend
2. Delete the `test.db` file in the `backend` folder
3. Restart the FastAPI backend (it will create a new empty database)
4. Create a new account

## What Changed in the Code

### `pages/index.tsx` (Login Page)

- Added `setTimeout` wrapper around `router.push("/dashboard")` to ensure state is saved before redirect

### `pages/signup.tsx` (Signup Page)

- Added `setTimeout` wrapper around `router.push("/dashboard")` to ensure state is saved before redirect

### `.env.local` (New File)

- Set `BACKEND_URL=http://localhost:8001` for consistent backend connection
