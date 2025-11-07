# Student Wellness App

A comprehensive student wellness tracking application that helps students monitor and improve their mental health through daily health reports and trend analysis.

## 🌟 Features

### User Management

- **User Registration**: Secure account creation with email validation
- **Authentication**: Password-based login with bcrypt hashing
- **Session Management**: Persistent login sessions with localStorage

### Health Tracking

- **Daily Reports**: Submit stress levels, mood, sleep hours, and comments
- **Trend Analysis**: Interactive charts showing health patterns over time
- **Personalized Dashboard**: User-specific data visualization

### Data Visualization

- **Stress Level Trends**: Track stress patterns with line charts
- **Mood Analysis**: Monitor emotional well-being over time
- **Sleep Tracking**: Analyze sleep quality and duration
- **Time Range Filtering**: View data by day, week, or month

## 🛠 Tech Stack

### Frontend

- **Next.js 16**: React framework with TypeScript
- **Chart.js**: Interactive data visualization
- **Tailwind CSS**: Utility-first styling (inline styles used)

### Backend

- **FastAPI**: Modern Python web framework
- **SQLModel**: SQL database ORM with Pydantic
- **SQLite**: Lightweight database for development
- **bcrypt**: Password hashing for security

### Development Tools

- **Python 3.12**: Backend runtime
- **Node.js**: Frontend runtime
- **Git**: Version control

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Jz2435/student-wellness.git
   cd student-wellness
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd ..  # Back to root directory
   npm install
   ```

### Running the Application

1. **Start Backend** (Terminal 1)

   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

2. **Start Frontend** (Terminal 2)

   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

## 📖 Usage

### User Registration

1. Visit http://localhost:3001
2. Click "Create account"
3. Fill in your details:
   - Full name
   - Email address
   - Password (min 8 characters, 1 letter, 1 number)
   - Confirm password
4. Accept terms and conditions
5. Click "Create Account"

### Daily Health Reporting

1. Log in to your account
2. Click "Submit Daily Report" from dashboard
3. Fill in your health metrics:
   - Stress level (1-10)
   - Current mood
   - Hours of sleep
   - Additional comments
4. Click "Submit"

### Viewing Trends

- **Dashboard**: Overview of all your health metrics
- **Stress Trends**: Detailed stress level analysis
- **Mood Trends**: Emotional well-being patterns
- **Sleep Trends**: Sleep quality tracking

## 🗄 Database Schema

### Students Table

```sql
CREATE TABLE student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
```

### Self Reports Table

```sql
CREATE TABLE selfreport (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    stress_level INTEGER NOT NULL,
    mood TEXT NOT NULL,
    sleep_hours REAL NOT NULL,
    comments TEXT DEFAULT '',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id)
);
```

## 🔌 API Documentation

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

**Response:**

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

#### POST `/api/login`

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "john@university.edu",
  "password": "securepassword123"
}
```

**Response:**

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

#### GET `/api/self-reports?student_id={id}`

Retrieve health reports for a specific user.

**Response:**

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
  }
]
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Client and server-side validation
- **SQL Injection Protection**: Parameterized queries via SQLModel
- **CORS Configuration**: Restricted to localhost origins
- **Session Management**: Secure token-based authentication

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration with valid/invalid data
- [ ] User login with correct/incorrect credentials
- [ ] Health report submission
- [ ] Dashboard data display
- [ ] Trend chart rendering
- [ ] Time range filtering
- [ ] Logout functionality

### API Testing

```bash
# Test backend health
curl http://localhost:8001/

# Test signup
curl -X POST http://localhost:8001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Backend Deployment

```bash
# Production server
uvicorn main:app --host 0.0.0.0 --port 8000

# With Gunicorn (recommended for production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file for production:

```env
# Backend
DATABASE_URL=sqlite:///./prod.db

# Frontend
NEXT_PUBLIC_API_URL=http://your-backend-url:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write clear commit messages
- Test both frontend and backend changes
- Update documentation for new features
- Ensure responsive design works on mobile devices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js, FastAPI, and Chart.js
- Inspired by the need for better student mental health tracking
- Thanks to the open-source community for amazing tools

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Happy coding! 🌱** Keep track of your wellness journey with data-driven insights.
