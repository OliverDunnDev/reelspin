
import { useEffect, useState } from "react"
import { ArrowLeft, Users, Film } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

import api from "../api"
import MoviePicker from "../components/MoviePicker"

function ClubDetails() {
  const { clubId } = useParams()
  const navigate = useNavigate()

  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showMoviePicker, setShowMoviePicker] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieHistory, setMovieHistory] = useState([])
  const [members, setMembers] = useState([])
  const [myRating, setMyRating] = useState(null)
  const [watched, setWatched] = useState(false)
  const [savingRating, setSavingRating] = useState(false)
  const [ratingStats, setRatingStats] = useState(null)

  async function saveRating(newRating, newWatched) {
    if (!selectedMovie) return

    try {
      setSavingRating(true)

      const response = await api.put(
        `/clubs/${clubId}/movies/${selectedMovie.id}/rating`,
        {
          rating: newRating,
          watched: newWatched,
        }
      )

      setMyRating(response.data.rating)
      setWatched(response.data.watched)
    } catch (error) {
      console.error(
        "Failed to save rating:",
        error.response?.data || error
      )
    } finally {
      setSavingRating(false)
    }
  }

  async function handleMovieSelect(movie) {
    try {
      const movieData = {
        movie_id: movie.id,
        title: movie.title,
        year: movie.year,
        rating: movie.rating,
        genre: movie.genre,
        poster: movie.poster,
        overview: movie.overview,
      }

      const response = await api.post(
        `/clubs/${clubId}/movies`,
        movieData
      )

      setSelectedMovie(response.data)
      setShowMoviePicker(false)
    } catch (error) {
      console.error(
        "Failed to save movie:",
        error.response?.data || error
      )
    }
  }

  useEffect(() => {
    async function fetchClubDetails() {
      try {
        setLoading(true)
        setError("")

        const clubResponse = await api.get(
          `/clubs/${clubId}`
        )

        setClub(clubResponse.data)

        try {
          const movieResponse = await api.get(
            `/clubs/${clubId}/movies`
          )

          setSelectedMovie(movieResponse.data)
        } catch (movieError) {
          console.error(
            "Failed to fetch current movie:",
            movieError.response?.data || movieError
          )

          setSelectedMovie(null)
        }
      } catch (error) {
        console.error(
          "Failed to fetch club:",
          error.response?.data || error
        )

        setError("Unable to load this club.")
      } finally {
        setLoading(false)
      }
      try {
  const historyResponse = await api.get(
    `/clubs/${clubId}/history`
  )
  
  setMovieHistory(historyResponse.data)
} catch (historyError) {
  console.error(
    "Failed to fetch movie history:",
    historyError.response?.data || historyError
  )
}
try {
  const membersResponse = await api.get(
    `/clubs/${clubId}/members`
  )

  setMembers(membersResponse.data)
} catch (membersError) {
  console.error(
    "Failed to fetch members:",
    membersError.response?.data || membersError
  )
}
    }

    fetchClubDetails()
  }, [clubId])

  useEffect(() => {
  async function fetchMyRating() {
    if (!selectedMovie) {
      setMyRating(null)
      setWatched(false)
      return
    }

    try {
      const response = await api.get(
        `/clubs/${clubId}/movies/${selectedMovie.id}/rating`
      )

      if (response.data) {
        setMyRating(response.data.rating)
        setWatched(response.data.watched)
      } else {
        setMyRating(null)
        setWatched(false)
      }
    } catch (error) {
      console.error(
        "Failed to fetch rating:",
        error.response?.data || error
      )
    }
  }

  

  fetchMyRating()
}, [clubId, selectedMovie])
useEffect(() => {
  async function fetchRatingStats() {
    if (!selectedMovie) {
      setRatingStats(null)
      return
    }

    try {
      const response = await api.get(
        `/clubs/${clubId}/movies/${selectedMovie.id}/rating/stats`
      )

      setRatingStats(response.data)
    } catch (error) {
      console.error(
        "Failed to fetch rating stats:",
        error.response?.data || error
      )

      setRatingStats(null)
    }
  }

  fetchRatingStats()
}, [clubId, selectedMovie])

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Loading club...
      </div>
    )
  }

  if (error || !club) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-600">
          {error || "Club not found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/clubs")}
          className="mt-4 text-sm font-semibold text-purple-600"
        >
          Back to clubs
        </button>
      </div>
    )
  }

  return (
    <div>
      <header className="flex h-20 items-center border-b border-gray-200 bg-white px-8">
        <button
          type="button"
          onClick={() => navigate("/clubs")}
          className="mr-4 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-lg font-semibold">
          {club.name}
        </h1>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-purple-600">
            Your film community
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {club.name}
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your club and discover your next film.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Users size={22} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Members
            </h3>

            <p className="mt-2 text-sm text-gray-500">
                {members.length}{" "}
                {members.length === 1 ? "member" : "members"}
            </p>

            <div className="mt-4 space-y-2">
            {members.map((member) => (
                <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2"
                >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600">
                    {member.username.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm font-medium text-gray-700">
                    {member.username}
                </span>
                </div>
            ))}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-sm font-medium text-gray-900">
                Invite code
            </p>

            <p className="mt-1 text-sm text-gray-500">
                Share this code with friends so they can join your club.
            </p>

            <div className="mt-3 flex items-center gap-2">
                <code className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-center text-lg font-bold tracking-widest text-gray-800">
                {club.invite_code || "Unavailable"}
                </code>

                <button
                type="button"
                onClick={() =>
                    navigator.clipboard.writeText(club.invite_code)
                }
                className="rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                Copy
                </button>
            </div>
            </div>

            <button
              type="button"
              className="mt-6 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Invite members
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Film size={22} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Current film
            </h3>

            {selectedMovie ? (
  <div className="mt-5">
    <div className="overflow-hidden rounded-2xl bg-gray-100">
      {selectedMovie.poster && (
        <img
          src={selectedMovie.poster}
          alt={selectedMovie.title}
          className="h-96 w-full object-contain"
        />
      )}
    </div>

    <div className="mt-5">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-2xl font-bold tracking-tight text-gray-900">
          {selectedMovie.title}
        </h4>

        <div className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-600">
          <span>★</span>
          {selectedMovie.rating}
        </div>
      </div>
      
      {ratingStats && (
  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
    <span>
      {ratingStats.rating_count > 0
        ? `★ ${ratingStats.average_rating.toFixed(1)} average`
        : "No member ratings yet"}
    </span>

    <span>
      · {ratingStats.watched_count}{" "}
      {ratingStats.watched_count === 1 ? "member" : "members"} watched
    </span>
  </div>
)}

      <p className="mt-2 text-sm text-gray-500">
        {selectedMovie.year} · {selectedMovie.genre}
      </p>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {selectedMovie.overview ||
            "No overview available for this film."}
        </p>

        {/* Personal film rating */}
<div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
  <div className="flex items-center justify-between">
    <h5 className="text-sm font-semibold text-gray-900">
      Your rating
    </h5>

    <label className="flex items-center gap-2 text-sm text-gray-600">
      <input
        type="checkbox"
        checked={watched}
        onChange={(event) =>
          saveRating(myRating, event.target.checked)
        }
        disabled={savingRating}
        className="rounded border-gray-300 text-purple-600"
      />
      Watched
    </label>
  </div>

  <div className="mt-3 flex gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => saveRating(star, watched)}
        disabled={savingRating}
        className={`text-2xl transition ${
          myRating >= star
            ? "text-yellow-400"
            : "text-gray-300 hover:text-yellow-300"
        }`}
        aria-label={`Rate ${star} out of 5`}
      >
        ★
      </button>
    ))}
  </div>

  {savingRating && (
    <p className="mt-2 text-xs text-gray-500">
      Saving...
    </p>
  )}
</div>

      <button
        type="button"
        onClick={() => setShowMoviePicker(true)}
        className="mt-6 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
      >
        Change film
      </button>
    </div>
  </div>
) : (
              <div>
                <p className="mt-2 text-sm text-gray-500">
                  No film selected yet.
                </p>

                <button
                  type="button"
                  onClick={() => setShowMoviePicker(true)}
                  className="mt-6 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Choose a film
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Film History */}
<div className="mt-10">
  <div className="mb-5">
    <p className="text-sm font-medium text-purple-600">
      Your club's journey
    </p>

    <h3 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
      Film History
    </h3>

    <p className="mt-2 text-sm text-gray-500">
      Every film your club has selected.
    </p>
  </div>

  {movieHistory.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
      <p className="text-sm text-gray-500">
        Your film history will appear here.
      </p>
    </div>
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {movieHistory.map((movie) => (
        <div
          key={movie.id}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
        >
          {movie.poster && (
            <div className="bg-gray-100">
              <img
                src={movie.poster}
                alt={movie.title}
                className="h-64 w-full object-contain"
              />
            </div>
          )}

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-semibold text-gray-900">
                {movie.title}
              </h4>

              <span className="shrink-0 text-sm text-yellow-600">
                ★ {movie.rating}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {movie.year} · {movie.genre}
            </p>

            <p className="mt-3 text-xs text-gray-400">
              Selected on{" "}
              {new Date(movie.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      </main>

      {showMoviePicker && (
        <MoviePicker
          onClose={() => setShowMoviePicker(false)}
          onSelect={handleMovieSelect}
        />
      )}
    </div>
  )
}

export default ClubDetails