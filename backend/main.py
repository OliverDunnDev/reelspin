
import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, User
from routers.clubs import router as clubs_router
from routers.movies import router as movies_router
from routers.users import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Reelspin API")

allowed_origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://oliverdunndev.github.io",
}

extra_origins = os.getenv("CORS_ORIGINS", "")
allowed_origins.update(
    origin.strip()
    for origin in extra_origins.split(",")
    if origin.strip()
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(clubs_router)
app.include_router(movies_router)


@app.get("/")
async def root():
    return {"message": "Welcome to Reelspin API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/database-test")
def database_test(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    return {"database_connected": result.scalar() == 1}
