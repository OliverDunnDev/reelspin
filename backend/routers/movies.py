import json
import os
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query

load_dotenv()

router = APIRouter(prefix="/movies", tags=["Movies"])

TMDB_API_URL = "https://api.themoviedb.org/3"


@router.get("/search")
def search_movies(query: str = Query(min_length=1, max_length=100)):
    token = os.getenv("TMDB_BEARER_TOKEN")

    if not token:
        raise HTTPException(
            status_code=500,
            detail="TMDB API credentials are not configured.",
        )

    params = urlencode({
        "query": query.strip(),
        "include_adult": "false",
        "language": "en-GB",
        "page": 1,
    })

    request = Request(
        f"{TMDB_API_URL}/search/movie?{params}",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))

    except HTTPError as exc:
        if exc.code in (401, 403):
            raise HTTPException(
                status_code=502,
                detail="TMDB rejected the API credentials.",
            ) from exc

        raise HTTPException(
            status_code=502,
            detail="TMDB could not complete the movie search.",
        ) from exc

    except (URLError, TimeoutError, OSError) as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not connect to TMDB.",
        ) from exc

    return {
        "results": [
            {
                "id": movie["id"],
                "title": movie.get("title") or "Untitled",
                "year": (movie.get("release_date") or "")[:4] or None,
                "rating": movie.get("vote_average"),
                "poster": (
                    f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
                    if movie.get("poster_path")
                    else None
                ),
                "overview": movie.get("overview") or "",
            }
            for movie in data.get("results", [])
        ]
    }
