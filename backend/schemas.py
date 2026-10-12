from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class ClubCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)


class ClubResponse(ClubCreate):
    id: int
    owner_id: int
    invite_code: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class ClubMovieCreate(BaseModel):
    movie_id: int
    title: str
    year: int
    rating: float | None = None
    genre: str | None = None
    poster: str | None = None
    overview: str | None = None


class ClubMovieResponse(ClubMovieCreate):
    id: int
    club_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ClubMovieRatingUpdate(BaseModel):
    rating: float | None = None
    watched: bool | None = None


class ClubMovieRatingResponse(BaseModel):
    id: int
    club_movie_id: int
    user_id: int
    rating: float | None
    watched: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ClubMovieRatingUpdate(BaseModel):
    rating: float | None = None
    watched: bool | None = None


class ClubMovieRatingResponse(BaseModel):
    id: int
    club_movie_id: int
    user_id: int
    rating: float | None
    watched: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ClubMovieRatingStats(BaseModel):
    average_rating: float | None
    rating_count: int
    watched_count: int