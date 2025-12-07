# Student Wellness App

Student wellness tracking application for monitoring mental health through daily health reports and trend analysis.

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Chart.js
- **Backend**: FastAPI, Python, SQLModel, SQLite
- **Auth**: bcrypt password hashing

## Prerequisites

- Python 3.8+
- Node.js 18+
- Git

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

## Installation

**1. Clone repository**

```bash
git clone https://github.com/Jz2435/student-wellness.git
cd student-wellness
```

**2. Backend setup**

```bash
cd backend

# Create virtual environment
python -m venv venv  # Windows
python3 -m venv venv  # Mac/Linux

# Activate virtual environment
venv\Scripts\activate  # Windows CMD
venv\Scripts\Activate.ps1  # Windows PowerShell
source venv/bin/activate  # Mac/Linux/WSL

# Install dependencies
pip install -r requirements.txt
```

**3. Frontend setup**

```bash
cd ..
npm install
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
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

> **Important**: Use port **8001**. The frontend is configured to communicate with the backend on port 8001.

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
- **Backend API Documentation**: http://localhost:8001/docs
- **Backend API Root**: http://localhost:8001

## Running the Application

**Terminal 1 - Backend:**

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

**Access:**

- Application: http://localhost:3001
- API Docs: http://localhost:8001/docs

**Test Accounts:**

You can create your own student and admin accounts, or use the existing accounts:

- **Student Account**: `student@cornell.edu`, password: `Testpassword1`
- **Admin Account**: `admin@cornell.edu`, password: `Testpassword1`

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
- Try accessing http://localhost:8001 in your browser - you should see `{"message": "FastAPI is running"}`
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

## First Use

1. Open http://localhost:3001
2. Click "Create account"
3. Fill form (password: 8+ chars, 1 letter, 1 number)
4. Submit daily report from dashboard
5. View trends and analytics

**Admin:** http://localhost:3001/admin/login
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

## Troubleshooting

**Python command not found:** Use `python3` on Mac/Linux, `python` on Windows

**Port in use:** Kill process:

- Windows: `netstat -ano | findstr :8001`, end in Task Manager
- Mac/Linux: `lsof -ti:8001 | xargs kill -9`

**Module not found:**

- Backend: Activate venv, run `pip install -r requirements.txt`
- Frontend: Delete `node_modules`, run `npm install`

**Database errors:** Delete `backend/test.db`, restart backend

**PowerShell activation:** Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
Authenticate an admin user.

#### GET `/api/admin/alerts`

Retrieve all alerts (high stress reports requiring attention).



---

**Version**: 1.0.0

