# Student Wellness App

A comprehensive student wellness tracking application that helps students monitor and improve their mental health through daily health reports and trend analysis.

## ⚡ Quick Start

 Follow these steps:

1. Ensure you have [Python 3.8+](#prerequisites) and [Node.js 18+](#prerequisites) installed
2. Follow the [Installation Guide](#-installation-guide) step-by-step
3. [Run both servers](#-running-the-application) (backend and frontend)
4. Open http://localhost:3001 and [create your first account](#first-time-usage)
5. Having issues? Check [Troubleshooting](#-troubleshooting)


### User Management

- **User Registration**: Secure account creation with email validation
- **Authentication**: Password-based login with bcrypt hashing
- **Session Management**: Persistent login sessions with localStorage
- **Admin Dashboard**: Administrative interface for monitoring alerts and user reports

### Health Tracking

- **Daily Reports**: Submit stress levels, mood, sleep hours, and comments
- **Trend Analysis**: Interactive charts showing health patterns over time
- **Personalized Dashboard**: User-specific data visualization
- **Alert System**: Notifications for high stress levels requiring attention

### Data Visualization

- **Stress Level Trends**: Track stress patterns with line charts
- **Mood Analysis**: Monitor emotional well-being over time
- **Sleep Tracking**: Analyze sleep quality and duration
- **Time Range Filtering**: View data by day, week, or month

## 🛠 Tech Stack

### Frontend

- **Next.js 16**: React framework with TypeScript
- **Chart.js**: Interactive data visualization
- **React Icons**: Icon library for UI components

### Backend

- **FastAPI**: Modern Python web framework
- **SQLModel**: SQL database ORM with Pydantic
- **SQLite**: Lightweight database for development
- **bcrypt**: Password hashing for security
- **Uvicorn**: ASGI web server

### Development Tools

- **Python 3.8+**: Backend runtime
- **Node.js 18+**: Frontend runtime
- **Git**: Version control
- **TypeScript**: Type-safe JavaScript

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your computer:

### Required Software

1. **Python 3.8 or higher**

   - Download from: https://www.python.org/downloads/
   - Verify installation: `python --version` or `python3 --version`

2. **Node.js 18 or higher** (includes npm)

   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

3. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

### System-Specific Notes

- **Windows**: Use Command Prompt, PowerShell, or Git Bash
- **macOS/Linux**: Use Terminal
- **WSL (Windows Subsystem for Linux)**: Follow Linux instructions

## 🚀 Installation Guide

Follow these steps carefully to set up the project on your local machine.

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/Jz2435/student-wellness.git
cd student-wellness
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Create a Virtual Environment

**On macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows (Command Prompt):**

```bash
python -m venv venv
venv\Scripts\activate
```

**On Windows (PowerShell):**

```bash
python -m venv venv
venv\Scripts\Activate.ps1
```

**On Windows (Git Bash/WSL):**

```bash
python3 -m venv venv
source venv/bin/activate
```

> **Note**: After activation, you should see `(venv)` at the beginning of your terminal prompt.

#### 2.3 Install Python Dependencies

With the virtual environment activated, run:

```bash
pip install -r requirements.txt
```

This will install:

- `fastapi` - Web framework
- `uvicorn[standard]` - ASGI server
- `sqlmodel` - Database ORM
- `bcrypt` - Password hashing

### Step 3: Frontend Setup

#### 3.1 Return to Root Directory

```bash
cd ..
```

You should now be in the `student-wellness` directory (not `backend`).

#### 3.2 Install Node.js Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Chart.js, and TypeScript.

> **Note**: This may take a few minutes depending on your internet connection.

### Step 4: Verify Installation

At this point, you should have:

- ✅ Python virtual environment created in `backend/venv/`
- ✅ Python packages installed
- ✅ Node.js packages installed in `node_modules/`
- ✅ Database will be created automatically on first run

## 🏃 Running the Application

You need to run **both** the backend and frontend servers simultaneously. Open **two separate terminal windows**.

### Terminal 1: Start the Backend Server

#### Step 1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2: Activate Virtual Environment

**On macOS/Linux/Git Bash/WSL:**

```bash
source venv/bin/activate
```

**On Windows (Command Prompt):**

```bash
venv\Scripts\activate
```

**On Windows (PowerShell):**

```bash
venv\Scripts\Activate.ps1
```

#### Step 3: Start the Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

> **Important**: Use port **8000** (not 8001). The frontend is configured to communicate with the backend on port 8000.

You should see output like:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

**Keep this terminal running!** The backend server must stay active.

### Terminal 2: Start the Frontend Server

#### Step 1: Navigate to Project Root

Open a **new terminal window** and navigate to the project directory:

```bash
cd student-wellness
```

#### Step 2: Start the Development Server

```bash
npm run dev
```

You should see output like:

```
> health-stress@1.0.0 dev
> next dev -p 3001

  ▲ Next.js 16.0.1
  - Local:        http://localhost:3001
```

**Keep this terminal running!** The frontend server must stay active.

### Step 5: Access the Application

Open your web browser and navigate to:

- **Main Application**: http://localhost:3001
- **Backend API Documentation**: http://localhost:8000/docs
- **Backend API Root**: http://localhost:8000


**Key Points:**

- Frontend runs on port **3001** and serves the user interface
- Backend runs on port **8000** and handles all data/logic
- Database is a SQLite file that's automatically created
- All three components must be running for the app to work properly

## 🎯 First-Time Usage

### Creating Your First Account

1. Open http://localhost:3001 in your browser
2. You'll see the login page
3. Click **"Create account"** (or navigate to http://localhost:3001/signup)
4. Fill in the registration form:
   - **Full Name**: Your name
   - **Email**: A valid email address
   - **Password**: At least 8 characters with 1 letter and 1 number
   - **Confirm Password**: Same as password
5. Check "I agree to the terms and conditions"
6. Click **"Create Account"**
7. You'll be automatically logged in and redirected to the dashboard

### Submitting Your First Health Report

1. From the dashboard, click **"Submit Daily Report"**
2. Fill in your health metrics:
   - **Stress Level**: Select 1 (low) to 10 (high)
   - **Mood**: Choose from Happy, Sad, Anxious, Neutral, Energetic, or Tired
   - **Sleep Hours**: Enter hours slept (e.g., 7.5)
   - **Comments**: Optional notes about your day
3. Click **"Submit"**
4. Your report will be saved and reflected in your dashboard trends

### Exploring Your Data

- **Dashboard**: View overview of your wellness metrics
- **Stress Trends**: Click to see detailed stress level charts
- **Mood Trends**: Analyze your emotional patterns
- **Sleep Trends**: Track your sleep quality over time
- **Notifications**: Check the bell icon for any alerts

### Admin Access (Optional)

Administrators can access additional features:

- Navigate to http://localhost:3001/admin/login
- Register an admin account at http://localhost:3001/admin/signup
- Monitor student alerts and reports

## 📝 Important Files & Folders

### Files You Should Know About

**Configuration Files:**

- `package.json` - Frontend dependencies and scripts
- `requirements.txt` - Backend Python dependencies
- `next.config.js` - Next.js configuration (API proxy settings)
- `tsconfig.json` - TypeScript configuration

**Code Files:**

- `backend/main.py` - Backend API logic
- `backend/models.py` - Database table definitions
- `pages/` - Frontend page components
- `components/` - Reusable UI components

**Auto-Generated (DO NOT EDIT MANUALLY):**

- `node_modules/` - Installed Node.js packages (created by `npm install`)
- `backend/venv/` - Python virtual environment (created during setup)
- `.next/` - Next.js build output
- `backend/test.db` - SQLite database file (created automatically)
- `backend/__pycache__/` - Python compiled files

### Files Ignored by Git

The `.gitignore` file ensures these files/folders are not committed to Git:

- `node_modules/` - Too large, reinstall with `npm install`
- `backend/venv/` - Environment-specific, recreate per installation
- `.env` files - May contain sensitive data
- `backend/test.db` - Local database (not for sharing)
- `.next/` - Build output (regenerated)

> **Beginner Tip**: You should never manually edit files in `node_modules/`, `venv/`, `.next/`, or `__pycache__/`. These are automatically generated.

## 🛠 Troubleshooting

### Common Issues and Solutions

#### Issue: "Command not found: python3" or "Command not found: python"

**Solution**:

- Verify Python is installed: Try both `python --version` and `python3 --version`
- On Windows, use `python` instead of `python3`
- Reinstall Python from https://python.org (make sure to check "Add Python to PATH")

#### Issue: "npm: command not found"

**Solution**:

- Install Node.js from https://nodejs.org
- Restart your terminal after installation
- Verify with `node --version` and `npm --version`

#### Issue: Virtual environment won't activate on Windows PowerShell

**Solution**:

- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Then try activating again: `venv\Scripts\Activate.ps1`
- Alternative: Use Command Prompt instead

#### Issue: Port already in use (EADDRINUSE)

**Solution**:

- Backend port 8001 is taken:
  ```bash
  # Find and kill the process using port 8001
  # On Linux/Mac: lsof -ti:8001 | xargs kill -9
  # On Windows: netstat -ano | findstr :8001
  # Then use Task Manager to end the process
  ```
- Frontend port 3001 is taken: The error message will suggest an alternative port

#### Issue: "Module not found" errors

**Solution**:

- **Backend**: Make sure virtual environment is activated, then run `pip install -r requirements.txt` again
- **Frontend**: Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

#### Issue: Database errors or "table not found"

**Solution**:

- Delete `backend/test.db` file
- Restart the backend server - it will automatically recreate the database with correct schema

#### Issue: Frontend can't connect to backend (API errors)

**Solution**:

- Verify backend is running on port **8001** 
- Check that both servers are running simultaneously
- Try accessing http://localhost:8000 in your browser - you should see `{"message": "FastAPI is running"}`
- Clear browser cache and reload the page

#### Issue: Changes not appearing after editing code

**Solution**:

- Backend: The `--reload` flag should auto-reload. If not, stop (Ctrl+C) and restart the server
- Frontend: Next.js auto-reloads. If not working, stop (Ctrl+C) and restart `npm run dev`
- Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)


## 🗄 Database Schema

The application uses SQLite with the following tables (automatically created on first run):

### Students Table

Stores user account information.

```sql
CREATE TABLE student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL  -- Hashed with bcrypt
);
```

### Self Reports Table

Stores daily health reports submitted by students.

```sql
CREATE TABLE selfreport (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    stress_level INTEGER NOT NULL,      -- 1-10 scale
    mood TEXT NOT NULL,                 -- Happy, Sad, Anxious, etc.
    sleep_hours REAL NOT NULL,          -- Decimal hours (e.g., 7.5)
    comments TEXT DEFAULT '',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id)
);
```

### Admins Table

Stores administrator accounts.

```sql
CREATE TABLE admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL  -- Hashed with bcrypt
);
```

### Alerts Table

Stores system-generated alerts for high stress levels.

```sql
CREATE TABLE alert (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unresolved',  -- 'unresolved' or 'resolved'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id)
);
```

### Notifications Table

Stores notifications sent to users.

```sql
CREATE TABLE notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id)
);
```

> **Note**: You don't need to create these tables manually. They are automatically created when you first start the backend server.

## 🔌 API Documentation

The backend provides a RESTful API. You can view interactive documentation at http://localhost:8000/docs (when the backend is running).

### Authentication Endpoints

#### POST `/api/signup`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "securepassword123"
}
```

**Success Response (201 Created):**

```json
{
  "message": "Account created successfully",
  "token": "random_token_string",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@university.edu"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "detail": "Email already registered"
}
```

#### POST `/api/login`

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "john@university.edu",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**

```json
{
  "token": "random_token_string",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@university.edu"
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "detail": "Invalid credentials"
}
```

### Health Report Endpoints

#### POST `/api/self-report`

Submit a new health report.

**Request Body:**

```json
{
  "student_id": 1,
  "stress_level": 7,
  "mood": "neutral",
  "sleep_hours": 6.5,
  "comments": "Feeling a bit stressed about exams"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Report submitted successfully",
  "report_id": 1
}
```

**Validation Rules:**

- `stress_level`: Integer between 1-10
- `mood`: One of: Happy, Sad, Anxious, Neutral, Energetic, Tired
- `sleep_hours`: Positive decimal number
- `comments`: Optional string

#### GET `/api/self-reports?student_id={id}`

Retrieve all health reports for a specific student.

**Query Parameters:**

- `student_id` (required): The student's ID

**Success Response (200 OK):**

```json
[
  {
    "id": 1,
    "student_id": 1,
    "stress_level": 7,
    "mood": "neutral",
    "sleep_hours": 6.5,
    "comments": "Feeling a bit stressed about exams",
    "timestamp": "2025-11-07T10:30:00"
  },
  {
    "id": 2,
    "student_id": 1,
    "stress_level": 5,
    "mood": "happy",
    "sleep_hours": 8.0,
    "comments": "Feeling much better today",
    "timestamp": "2025-11-08T09:15:00"
  }
]
```

### Admin Endpoints

#### POST `/api/admin/signup`

Register a new admin account.

#### POST `/api/admin/login`

Authenticate an admin user.

#### GET `/api/admin/alerts`

Retrieve all alerts (high stress reports requiring attention).

### Testing the API

You can test the API using:

1. **Interactive Documentation**: http://localhost:8001/docs

   - Click on any endpoint to expand it
   - Click "Try it out"
   - Fill in the request body
   - Click "Execute"

2. **cURL Commands** (in terminal):

```bash
# Test signup
curl -X POST http://localhost:8000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Submit a health report
curl -X POST http://localhost:8001/api/self-report \
  -H "Content-Type: application/json" \
  -d '{"student_id":1,"stress_level":5,"mood":"happy","sleep_hours":8,"comments":"Feeling good"}'

# Get reports for student
curl http://localhost:8001/api/self-reports?student_id=1
```

3. **Postman or Insomnia**: Import the endpoints and test interactively

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt before storage
- **Input Validation**: Client and server-side validation for all user inputs
- **SQL Injection Protection**: Parameterized queries via SQLModel ORM
- **CORS Configuration**: Cross-Origin Resource Sharing configured for security
- **Session Management**: Secure token-based authentication
- **Unique Email Constraint**: Prevents duplicate account creation

## 🧪 Testing

### Manual Testing Checklist

Test these features to ensure everything is working:

- [ ] User registration with valid data
- [ ] User registration with invalid data (weak password, duplicate email)
- [ ] User login with correct credentials
- [ ] User login with incorrect credentials
- [ ] Health report submission
- [ ] Dashboard data display showing submitted reports
- [ ] Trend chart rendering (stress, mood, sleep)
- [ ] Time range filtering in trends
- [ ] Notifications display
- [ ] Logout functionality
- [ ] Admin login and signup
- [ ] Admin dashboard alert viewing

### Automated API Testing

The backend includes FastAPI's automatic API documentation. Visit http://localhost:8001/docs to:

1. View all available endpoints
2. See request/response schemas
3. Test endpoints directly in the browser
4. View example requests and responses

You can also run manual tests using cURL (see API Documentation section above).

## 🚀 Deployment (Advanced)

This section is for deploying to production. If you're just testing locally, you can skip this.

### Preparing for Production

#### 1. Update Configuration

Create environment-specific configuration files:

**Backend** - Create `.env` in `backend/` directory:

```env
DATABASE_URL=sqlite:///./production.db
ENVIRONMENT=production
```

**Frontend** - Create `.env.local` in root directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

#### 2. Build the Frontend

```bash
npm run build
npm start
```

> **Note**: You'll need to add a build script to `package.json`:
>
> ```json
> "scripts": {
>   "build": "next build",
>   "start": "next start"
> }
> ```

### Deployment Options

#### Option 1: Deploy Backend to Heroku/Railway

```bash
# Using Uvicorn
uvicorn main:app --host 0.0.0.0 --port 8001
```

For production with multiple workers, install Gunicorn:

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

#### Option 2: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 3: Docker Deployment

Create `Dockerfile` for containerized deployment (advanced users).


### Understanding the Code

- **Backend (`backend/main.py`)**: Handles API requests, database operations, and authentication
- **Frontend Pages (`pages/`)**: Each file represents a route/page in the application
- **Components (`components/`)**: Reusable UI elements
- **Hooks (`hooks/`)**: Custom React logic for authentication and notifications

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Maintained by**: Student Wellness Development Team


