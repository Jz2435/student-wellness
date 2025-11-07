from sqlmodel import SQLModel, Field
from datetime import datetime

class Student(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str

class SelfReport(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    stress_level: int
    mood: str
    sleep_hours: float
    comments: str = Field(default="")
    timestamp: datetime = Field(default_factory=datetime.utcnow)