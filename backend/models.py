from sqlmodel import SQLModel, Field
from datetime import datetime

class SelfReport(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    stress_level: int
    mood: str
    sleep_hours: float
    comments: str = Field(default="")
    timestamp: datetime = Field(default_factory=datetime.utcnow)