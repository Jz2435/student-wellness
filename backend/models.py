from sqlmodel import SQLModel, Field
from datetime import datetime

class Student(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str

class Admin(SQLModel, table=True):
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

class Notification(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    title: str
    message: str
    is_read: bool = Field(default=False)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Alert(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    risk_score: float
    severity: str
    condition: str
    triggered_at: datetime = Field(default_factory=datetime.utcnow)
    status: str
    ack_at: datetime = Field(default=None, nullable=True)
    resolved_at: datetime = Field(default=None, nullable=True)