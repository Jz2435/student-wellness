from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from models import SelfReport, Student, Notification
from pydantic import BaseModel
import bcrypt
import secrets

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

app = FastAPI()

# Enable CORS for localhost:3001 (Next.js default in package.json)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, echo=True)


@app.on_event("startup")
async def on_startup():
    SQLModel.metadata.create_all(engine)


@app.get("/")
async def root():
    return {"message": "FastAPI is running"}


@app.get("/test")
async def read_root():
    return {"message": "Welcome to the Self-Report API!"}


def get_session():
    with Session(engine) as session:
        yield session


@app.post("/api/signup")
async def signup(request: SignupRequest, session: Session = Depends(get_session)):
    if not request.name or not request.email or not request.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    
    # Check if email exists
    existing = session.exec(select(Student).where(Student.email == request.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")
    
    # Hash password
    hashed = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create student
    student = Student(name=request.name, email=request.email, password=hashed)
    session.add(student)
    session.commit()
    session.refresh(student)
    
    # Generate token
    token = secrets.token_hex(16)
    
    return {"message": "Account created successfully", "token": token, "user": {"id": str(student.id), "name": student.name, "email": student.email}}


@app.post("/api/login")
async def login(request: LoginRequest, session: Session = Depends(get_session)):
    if not request.email or not request.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    student = session.exec(select(Student).where(Student.email == request.email)).first()
    if not student or not bcrypt.checkpw(request.password.encode('utf-8'), student.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate token
    token = secrets.token_hex(16)
    
    return {"token": token, "user": {"id": str(student.id), "name": student.name, "email": student.email}}


@app.post("/api/self-report")
async def create_self_report(report: SelfReport, session: Session = Depends(get_session)):
    session.add(report)
    session.commit()
    session.refresh(report)
    return {"message": "Report submitted successfully", "report_id": report.id}


@app.get("/api/self-reports")
async def get_self_reports(student_id: int = None, session: Session = Depends(get_session)):
    if student_id:
        reports = session.exec(select(SelfReport).where(SelfReport.student_id == student_id)).all()
    else:
        reports = session.exec(select(SelfReport)).all()
    return reports


@app.get("/api/notifications")
async def get_notifications(student_id: str, session: Session = Depends(get_session)):
    notifications = session.exec(
        select(Notification).where(Notification.student_id == int(student_id)).order_by(Notification.timestamp.desc())
    ).all()
    return notifications


@app.put("/api/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: int, session: Session = Depends(get_session)):
    notification = session.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    session.commit()
    return {"message": "Notification marked as read"}


@app.post("/api/notifications")
async def create_notification(notification: Notification, session: Session = Depends(get_session)):
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return {"message": "Notification created", "notification_id": notification.id}


@app.post("/api/sample-notifications")
async def create_sample_notifications(student_id: str, session: Session = Depends(get_session)):
    from datetime import datetime, timedelta
    import random
    
    sample_notifications = [
        {
            "student_id": int(student_id),
            "title": "Welcome to Wellness Tracker!",
            "message": "Thank you for joining our wellness program. Start by submitting your first daily report.",
            "is_read": False,
            "timestamp": datetime.utcnow() - timedelta(days=2)
        },
        {
            "student_id": int(student_id),
            "title": "Daily Report Reminder",
            "message": "Don't forget to submit your daily wellness report. Consistent tracking helps you understand your patterns.",
            "is_read": False,
            "timestamp": datetime.utcnow() - timedelta(hours=12)
        },
        {
            "student_id": int(student_id),
            "title": "Stress Level Alert",
            "message": "Your recent stress levels have been high. Consider taking some time for relaxation activities.",
            "is_read": True,
            "timestamp": datetime.utcnow() - timedelta(days=1)
        },
        {
            "student_id": int(student_id),
            "title": "Sleep Pattern Insight",
            "message": "Your sleep data shows improvement! Keep up the good work with your sleep hygiene.",
            "is_read": True,
            "timestamp": datetime.utcnow() - timedelta(days=3)
        },
        {
            "student_id": int(student_id),
            "title": "Mood Tracking Milestone",
            "message": "You've been tracking your mood for a week now. Great job maintaining consistency!",
            "is_read": False,
            "timestamp": datetime.utcnow() - timedelta(hours=6)
        }
    ]
    
    for notif_data in sample_notifications:
        notification = Notification(**notif_data)
        session.add(notification)
    
    session.commit()
    return {"message": "Sample notifications created"}