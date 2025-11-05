from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from models import SelfReport

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


@app.post("/api/self-report")
async def create_self_report(report: SelfReport, session: Session = Depends(get_session)):
    session.add(report)
    session.commit()
    session.refresh(report)
    return {"message": "Report submitted successfully", "report_id": report.id}


@app.get("/api/self-reports")
async def get_self_reports(session: Session = Depends(get_session)):
    reports = session.exec(select(SelfReport)).all()
    return reports