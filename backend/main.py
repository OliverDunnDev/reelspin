from fastapi import FastAPI
from routers.users import router as users_router
from database import engine
from models import Base, User
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import get_db
from routers.clubs import router as clubs_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Reelspin API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users_router)
app.include_router(clubs_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Reelspin API"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }

@app.get("/database-test")
def database_test(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    value = result.scalar()

    return {
        "database_connected": value == 1
    }