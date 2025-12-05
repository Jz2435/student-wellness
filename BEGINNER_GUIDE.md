# Getting Started - For Complete Beginners

Never set up a web development project before? No problem! This guide will walk you through everything step by step.

## What You're About to Build

You'll set up a web application that:

- Runs on your own computer (not on the internet yet)
- Has a website you can open in your browser
- Has a backend server that stores data in a database
- Lets you track stress, mood, and sleep patterns

## Part 1: Installing Required Software

### 1.1 Install Python

**What is Python?** A programming language used for the backend server.

**Steps:**

1. Go to https://www.python.org/downloads/
2. Click the big yellow "Download Python" button
3. Run the installer
4. **IMPORTANT**: Check the box that says "Add Python to PATH"
5. Click "Install Now"
6. Wait for installation to complete

**Verify it worked:**

- Open Command Prompt (Windows) or Terminal (Mac/Linux)
- Type: `python --version` or `python3 --version`
- You should see something like "Python 3.12.0"

### 1.2 Install Node.js

**What is Node.js?** A runtime that lets you run JavaScript on your computer (needed for the frontend).

**Steps:**

1. Go to https://nodejs.org/
2. Download the "LTS" version (recommended)
3. Run the installer
4. Click "Next" through all the steps (default settings are fine)
5. Wait for installation to complete

**Verify it worked:**

- Open a new Command Prompt or Terminal
- Type: `node --version`
- You should see something like "v20.10.0"
- Type: `npm --version`
- You should see something like "10.2.3"

### 1.3 Install Git

**What is Git?** A tool to download code from GitHub.

**Steps:**

1. Go to https://git-scm.com/downloads
2. Download the version for your operating system
3. Run the installer
4. Use default settings (just click "Next" through everything)

**Verify it worked:**

- Open a new Command Prompt or Terminal
- Type: `git --version`
- You should see something like "git version 2.42.0"

## Part 2: Getting the Code

### 2.1 Choose a Location

Decide where you want to store the project. For example:

- **Windows**: `C:\Users\YourName\Documents\Projects\`
- **Mac**: `/Users/YourName/Documents/Projects/`
- **Linux**: `/home/YourName/Projects/`

### 2.2 Download the Project

1. Open Command Prompt or Terminal
2. Navigate to your chosen location:

   ```bash
   # Windows
   cd C:\Users\YourName\Documents\Projects

   # Mac/Linux
   cd ~/Documents/Projects
   ```

3. Download the code:

   ```bash
   git clone https://github.com/Jz2435/student-wellness.git
   ```

4. Go into the project folder:
   ```bash
   cd student-wellness
   ```

## Part 3: Installing Project Dependencies

### 3.1 Set Up the Backend

**What are we doing?** Installing the Python packages the backend needs.

1. Go into the backend folder:

   ```bash
   cd backend
   ```

2. Create a "virtual environment" (a isolated place for Python packages):

   **On Windows:**

   ```bash
   python -m venv venv
   ```

   **On Mac/Linux:**

   ```bash
   python3 -m venv venv
   ```

3. Activate the virtual environment:

   **On Windows (Command Prompt):**

   ```bash
   venv\Scripts\activate
   ```

   **On Windows (PowerShell):**

   ```bash
   venv\Scripts\Activate.ps1
   ```

   **On Mac/Linux:**

   ```bash
   source venv/bin/activate
   ```

   **Success Check**: You should see `(venv)` at the start of your command line.

4. Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

   This will download and install FastAPI, uvicorn, SQLModel, and bcrypt.

5. Go back to the main project folder:
   ```bash
   cd ..
   ```

### 3.2 Set Up the Frontend

**What are we doing?** Installing the JavaScript packages the frontend needs.

1. Make sure you're in the main `student-wellness` folder (not `backend`)

2. Install the required packages:

   ```bash
   npm install
   ```

   **Note**: This might take 2-5 minutes. You'll see a lot of text scrolling by - that's normal!

## Part 4: Running the Application

You need TWO terminal windows open at the same time - one for the backend, one for the frontend.

### 4.1 Start the Backend (Terminal 1)

1. Open your first terminal
2. Navigate to the project:
   ```bash
   cd path/to/student-wellness/backend
   ```
3. Activate the virtual environment:

   **Windows (Command Prompt):**

   ```bash
   venv\Scripts\activate
   ```

   **Mac/Linux:**

   ```bash
   source venv/bin/activate
   ```

4. Start the backend server:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. **Success Check**: You should see:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
   ```

**Keep this terminal window open!** Don't close it or press Ctrl+C.

### 4.2 Start the Frontend (Terminal 2)

1. Open a NEW terminal window (don't use the same one as the backend!)
2. Navigate to the project:
   ```bash
   cd path/to/student-wellness
   ```
3. Start the frontend server:

   ```bash
   npm run dev
   ```

4. **Success Check**: You should see:
   ```
   ▲ Next.js 16.0.1
   - Local:        http://localhost:3001
   ```

**Keep this terminal window open too!**

### 4.3 Open the Application

1. Open your web browser (Chrome, Firefox, Safari, Edge, etc.)
2. Go to: http://localhost:3001
3. You should see the login page!

## Part 5: Using the Application

### Create Your First Account

1. Click "Create account"
2. Fill in:
   - Name: Your name
   - Email: Any email (doesn't have to be real)
   - Password: At least 8 characters with a number (e.g., "mypassword123")
   - Confirm Password: Same password again
3. Check the "I agree" box
4. Click "Create Account"

You're now logged in!

### Submit Your First Report

1. Click "Submit Daily Report"
2. Fill in:
   - Stress Level: Pick a number 1-10
   - Mood: Pick how you feel
   - Sleep Hours: How many hours you slept (e.g., 7.5)
   - Comments: Optional notes
3. Click "Submit"

### View Your Data

- Click "Dashboard" to see an overview
- Click "Stress Trends" to see charts
- Try submitting a few more reports to see the trends change!

## Troubleshooting

### "python: command not found"

**Solution**:

- Try `python3` instead of `python`
- Or reinstall Python and make sure to check "Add to PATH"

### "Port is already in use"

**Solution**:

- Another program is using that port
- Try restarting your computer
- Or change the port number in the commands

### "Module not found" or "Package not found"

**Solution**:

- Make sure you activated the virtual environment (see `(venv)` in terminal)
- Run `pip install -r requirements.txt` again in the backend folder
- Run `npm install` again in the main folder

### Frontend shows "Cannot connect to backend"

**Solution**:

- Make sure the backend is running (check Terminal 1)
- The backend should be on port 8000 (not 8001)
- Try accessing http://localhost:8000 in your browser - you should see a message

### Still stuck?

- Check the main [README.md](README.md) file for more detailed troubleshooting
- Read the error message carefully - it often tells you what's wrong
- Try the steps again from the beginning
- Search for the error message online

## Stopping the Application

When you're done testing:

1. Go to Terminal 1 (backend) and press `Ctrl+C`
2. Go to Terminal 2 (frontend) and press `Ctrl+C`
3. Close the browser tabs

## Starting Again Later

When you want to run the app again:

1. Open two terminals
2. In Terminal 1:
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
3. In Terminal 2:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3001

## Next Steps

Now that you have it running:

- Explore all the features
- Try the admin dashboard at http://localhost:3001/admin/login
- Look at the API documentation at http://localhost:8000/docs
- Read the main README.md to learn about the code structure
- Try modifying some code and see what happens!

## Understanding What You Built

- **Frontend**: The website you see in your browser (React/Next.js)
- **Backend**: The server that handles data (Python/FastAPI)
- **Database**: The file where data is stored (SQLite)

They all work together:
Browser → Frontend → Backend → Database

Congratulations! You're now running a full-stack web application! 🎉
