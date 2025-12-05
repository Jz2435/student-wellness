# Setup Checklist

Use this checklist to ensure you've successfully set up the Student Wellness App.

## ✅ Prerequisites Check

- [ ] Python 3.8+ installed (`python --version` or `python3 --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)

## ✅ Installation Steps

- [ ] Repository cloned to local machine
- [ ] Navigated to `backend/` directory
- [ ] Created Python virtual environment (`venv` folder exists in `backend/`)
- [ ] Activated virtual environment (see `(venv)` in terminal prompt)
- [ ] Installed Python packages (`pip install -r requirements.txt` completed)
- [ ] Returned to root directory
- [ ] Installed Node.js packages (`npm install` completed)
- [ ] `node_modules/` folder created in root directory

## ✅ Running the Application

### Backend Server

- [ ] Terminal 1 opened
- [ ] Navigated to `backend/` directory
- [ ] Virtual environment activated
- [ ] Started backend: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
- [ ] Backend running (see "Uvicorn running on http://0.0.0.0:8000")
- [ ] Can access http://localhost:8000 (shows `{"message": "FastAPI is running"}`)
- [ ] Can access http://localhost:8000/docs (shows API documentation)

### Frontend Server

- [ ] Terminal 2 opened (separate from backend terminal)
- [ ] Navigated to project root directory
- [ ] Started frontend: `npm run dev`
- [ ] Frontend running (see "Local: http://localhost:3001")
- [ ] Can access http://localhost:3001 (shows login page)

## ✅ First-Time Usage

- [ ] Opened http://localhost:3001 in web browser
- [ ] Clicked "Create account" or navigated to /signup
- [ ] Successfully registered a new account
- [ ] Automatically logged in after registration
- [ ] Can see the dashboard
- [ ] Clicked "Submit Daily Report"
- [ ] Successfully submitted a health report
- [ ] Report appears in dashboard/trends

## ✅ Features Test

- [ ] Can log out and log back in
- [ ] Can view stress trends page
- [ ] Can view mood trends page
- [ ] Can view sleep trends page
- [ ] Can see notifications (bell icon)
- [ ] Charts display correctly
- [ ] Can submit multiple reports
- [ ] Trends update with new data

## ✅ Admin Features (Optional)

- [ ] Can access http://localhost:3001/admin/login
- [ ] Can create admin account at /admin/signup
- [ ] Can log in as admin
- [ ] Can view admin dashboard
- [ ] Can see alerts from students

## 🆘 If Something Doesn't Work

1. **Backend won't start:**

   - Check if port 8000 is already in use
   - Verify virtual environment is activated
   - Ensure all dependencies installed correctly

2. **Frontend won't start:**

   - Check if port 3001 is already in use
   - Delete `node_modules` and `.next` folders
   - Run `npm install` again

3. **Can't create account:**

   - Check that both servers are running
   - Open browser console (F12) to see error messages
   - Verify password meets requirements (8+ chars, 1 letter, 1 number)

4. **Database errors:**

   - Stop backend server
   - Delete `backend/test.db`
   - Restart backend server (will recreate database)

5. **Still having issues?**
   - Check the main [README.md](README.md) Troubleshooting section
   - Ensure you followed all steps in order
   - Check terminal output for specific error messages

---

## 🎉 Success!

If all checkboxes are checked, congratulations! You've successfully set up and tested the Student Wellness App.

You can now:

- Start developing new features
- Customize the application
- Deploy to production
- Contribute to the project

Refer to the main [README.md](README.md) for more detailed information about:

- API Documentation
- Database Schema
- Contributing Guidelines
- Deployment Options
