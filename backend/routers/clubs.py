from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db

from models import (
    Club,
    ClubMember,
    ClubMovie,
    ClubMovieRating,
    User,
)

from schemas import (
    ClubResponse,
    ClubMovieCreate,
    ClubMovieResponse,
    ClubMovieRatingUpdate,
    ClubMovieRatingResponse,
    ClubMovieRatingStats,
    ClubCreate,
)

import secrets


router = APIRouter(prefix="/clubs", tags=["Clubs"])


@router.post(
    "/",
    response_model=ClubResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_club(
    club_data: ClubCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_club = Club(
        name=club_data.name,
        owner_id=current_user.id,
        invite_code=secrets.token_hex(4).upper(),
    )

    db.add(new_club)
    db.commit()
    db.refresh(new_club)

    owner_membership = ClubMember(
        club_id=new_club.id,
        user_id=current_user.id,
    )

    db.add(owner_membership)
    db.commit()

    return new_club


@router.get("/", response_model=list[ClubResponse])
def get_my_clubs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clubs = db.scalars(
        select(Club).where(Club.owner_id == current_user.id)
    ).all()

    return clubs


@router.get("/{club_id}", response_model=ClubResponse)
def get_club(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    club = db.scalar(
        select(Club).where(
            (Club.id == club_id)
            & (Club.owner_id == current_user.id)
        )
    )

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    return club


@router.post(
    "/{club_id}/movies",
    response_model=ClubMovieResponse,
)
def select_club_movie(
    club_id: int,
    movie_data: ClubMovieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    club = db.scalar(
        select(Club).where(
            (Club.id == club_id)
            & (Club.owner_id == current_user.id)
        )
    )

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    club_movie = ClubMovie(
        club_id=club_id,
        movie_id=movie_data.movie_id,
        title=movie_data.title,
        year=movie_data.year,
        rating=movie_data.rating,
        genre=movie_data.genre,
        poster=movie_data.poster,
        overview=movie_data.overview,
    )

    db.add(club_movie)
    db.commit()
    db.refresh(club_movie)

    return club_movie


@router.get(
    "/{club_id}/movies",
    response_model=ClubMovieResponse | None,
)
def get_club_movie(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    club = db.scalar(
        select(Club).where(
            (Club.id == club_id)
            & (Club.owner_id == current_user.id)
        )
    )

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    club_movie = db.scalar(
        select(ClubMovie)
        .where(ClubMovie.club_id == club_id)
        .order_by(ClubMovie.created_at.desc())
    )

    return club_movie


@router.get(
    "/{club_id}/history",
    response_model=list[ClubMovieResponse],
)
def get_club_history(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    club = db.scalar(
        select(Club).where(
            (Club.id == club_id)
            & (Club.owner_id == current_user.id)
        )
    )

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    history = db.scalars(
        select(ClubMovie)
        .where(ClubMovie.club_id == club_id)
        .order_by(ClubMovie.created_at.desc())
    ).all()

    return history


@router.post("/{club_id}/join")
def join_club(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    club = db.scalar(
        select(Club).where(Club.id == club_id)
    )

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    existing_membership = db.scalar(
        select(ClubMember).where(
            (ClubMember.club_id == club_id)
            & (ClubMember.user_id == current_user.id)
        )
    )

    if existing_membership is not None:
        raise HTTPException(
            status_code=400,
            detail="You are already a member of this club",
        )

    membership = ClubMember(
        club_id=club_id,
        user_id=current_user.id,
    )

    db.add(membership)
    db.commit()

    return {
        "message": "Successfully joined club",
        "club_id": club_id,
    }


@router.get("/{club_id}/members")
def get_club_members(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    club = db.scalar(
        select(Club).where(Club.id == club_id)
    )

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found",
        )

    membership = db.scalar(
        select(ClubMember).where(
            (ClubMember.club_id == club_id)
            & (ClubMember.user_id == current_user.id)
        )
    )

    if membership is None:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this club",
        )

    members = db.execute(
        select(User)
        .join(
            ClubMember,
            ClubMember.user_id == User.id,
        )
        .where(ClubMember.club_id == club_id)
    ).scalars().all()

    return [
        {
            "id": member.id,
            "username": member.username,
        }
        for member in members
    ]


@router.post("/join/{invite_code}")
def join_club_by_code(
    invite_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    club = db.scalar(
        select(Club).where(
            Club.invite_code == invite_code.upper()
        )
    )

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid invite code",
        )

    existing_membership = db.scalar(
        select(ClubMember).where(
            (ClubMember.club_id == club.id)
            & (ClubMember.user_id == current_user.id)
        )
    )

    if existing_membership is not None:
        raise HTTPException(
            status_code=400,
            detail="You are already a member of this club",
        )

    membership = ClubMember(
        club_id=club.id,
        user_id=current_user.id,
    )

    db.add(membership)
    db.commit()

    return {
        "message": "Successfully joined club",
        "club_id": club.id,
        "club_name": club.name,
    }


@router.put(
    "/{club_id}/movies/{club_movie_id}/rating",
    response_model=ClubMovieRatingResponse,
)
def update_movie_rating(
    club_id: int,
    club_movie_id: int,
    rating_data: ClubMovieRatingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    membership = db.scalar(
        select(ClubMember).where(
            (ClubMember.club_id == club_id)
            & (ClubMember.user_id == current_user.id)
        )
    )

    if membership is None:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this club",
        )

    club_movie = db.scalar(
        select(ClubMovie).where(
            (ClubMovie.id == club_movie_id)
            & (ClubMovie.club_id == club_id)
        )
    )

    if club_movie is None:
        raise HTTPException(
            status_code=404,
            detail="Film not found",
        )

    if (
        rating_data.rating is not None
        and not 1 <= rating_data.rating <= 5
    ):
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5",
        )

    if (
        rating_data.rating is None
        and rating_data.watched is None
    ):
        raise HTTPException(
            status_code=400,
            detail="Provide a rating or watched status",
        )

    movie_rating = db.scalar(
        select(ClubMovieRating).where(
            (ClubMovieRating.club_movie_id == club_movie_id)
            & (ClubMovieRating.user_id == current_user.id)
        )
    )

    if movie_rating is None:
        movie_rating = ClubMovieRating(
            club_movie_id=club_movie_id,
            user_id=current_user.id,
            rating=rating_data.rating,
            watched=(
                rating_data.watched
                if rating_data.watched is not None
                else False
            ),
        )

        db.add(movie_rating)

    else:
        if rating_data.rating is not None:
            movie_rating.rating = rating_data.rating

        if rating_data.watched is not None:
            movie_rating.watched = rating_data.watched

    db.commit()
    db.refresh(movie_rating)

    return movie_rating


@router.get(
    "/{club_id}/movies/{club_movie_id}/rating",
    response_model=ClubMovieRatingResponse | None,
)
def get_movie_rating(
    club_id: int,
    club_movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    membership = db.scalar(
        select(ClubMember).where(
            (ClubMember.club_id == club_id)
            & (ClubMember.user_id == current_user.id)
        )
    )

    if membership is None:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this club",
        )

    movie_rating = db.scalar(
        select(ClubMovieRating).where(
            (ClubMovieRating.club_movie_id == club_movie_id)
            & (ClubMovieRating.user_id == current_user.id)
        )
    )

    return movie_rating

    
@router.get(
    "/{club_id}/movies/{club_movie_id}/rating/stats",
    response_model=ClubMovieRatingStats,
)
def get_movie_rating_stats(
    club_id: int,
    club_movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    membership = db.scalar(
        select(ClubMember).where(
            (ClubMember.club_id == club_id)
            & (ClubMember.user_id == current_user.id)
        )
    )

    if membership is None:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this club",
        )

    club_movie = db.scalar(
        select(ClubMovie).where(
            (ClubMovie.id == club_movie_id)
            & (ClubMovie.club_id == club_id)
        )
    )

    if club_movie is None:
        raise HTTPException(
            status_code=404,
            detail="Film not found",
        )

    ratings = db.scalars(
        select(ClubMovieRating).where(
            ClubMovieRating.club_movie_id == club_movie_id
        )
    ).all()

    rated_values = [
        rating.rating
        for rating in ratings
        if rating.rating is not None
    ]

    average_rating = (
        sum(rated_values) / len(rated_values)
        if rated_values
        else None
    )

    watched_count = sum(
        1
        for rating in ratings
        if rating.watched
    )

    return {
        "average_rating": average_rating,
        "rating_count": len(rated_values),
        "watched_count": watched_count,
    }
