from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from models import SelfReport, Student
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