from datetime import datetime
from sqlalchemy import Boolean

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

class Club(Base):
    __tablename__ = "clubs"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    invite_code = Column(String(12), unique=True, nullable=True)

class ClubMovie(Base):
    __tablename__ = "club_movies"

    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)

    movie_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    rating = Column(Float, nullable=True)
    genre = Column(String, nullable=True)
    poster = Column(String, nullable=True)
    overview = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ClubMember(Base):
    __tablename__ = "club_members"

    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

class ClubMovieRating(Base):
    __tablename__ = "club_movie_ratings"

    id = Column(Integer, primary_key=True, index=True)
    club_movie_id = Column(
        Integer,
        ForeignKey("club_movies.id"),
        nullable=False,
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )
    rating = Column(Float, nullable=True)
    watched = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ClubBacklogMovie(Base):
    __tablename__ = "club_backlog_movies"

    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(
        Integer,
        ForeignKey("clubs.id"),
        nullable=False,
    )

    movie_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    rating = Column(Float, nullable=True)
    genre = Column(String, nullable=True)
    poster = Column(String, nullable=True)
    overview = Column(String, nullable=True)

    added_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )
    created_at = Column(DateTime, default=datetime.utcnow)
