
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Film,
  Home,
  Users,
  Compass,
  History,
  Star,
  Search,
  ArrowLeft,
  Play,
  CheckCircle2,
} from "lucide-react"

const initialMovies = [
  {
    id: 1,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 2,
    title: "Inception",
    year: 2010,
    genre: "Thriller",
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 3,
    title: "Parasite",
    year: 2019,
    genre: "Drama",
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    id: 4,
    title: "The Grand Budapest Hotel",
    year: 2014,
    genre: "Comedy",
    rating: 8.1,
    poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
  },
  {
    id: 5,
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    genre: "Animation",
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
  },
  {
    id: 6,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    rating: 9.3,
    poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
  },
]

const initialClubs = [
  {
    id: 1,
    name: "Thursday Film Club",
    members: 5,
    nextFilm: "Interstellar",
    description: "A weekly pick for friends who love great cinema.",
  },
  {
    id: 2,
    name: "Cinema & Snacks",
    members: 4,
    nextFilm: "Parasite",
    description: "International films and unexpected favourites.",
  },
]

function Demo() {
  const [section, setSection] = useState("Overview")
  const [search, setSearch] = useState("")
  const [ratings, setRatings] = useState({})
  const [watched, setWatched] = useState([3])
  const [saved, setSaved] = useState([4])
  const [notice, setNotice] = useState("")

  const movies = useMemo(
    () =>
      initialMovies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

  function changeSection(nextSection) {
    setSection(nextSection)
    setSearch("")
    setNotice("")
  }

  function toggleWatched(id) {
    setWatched((current) =>
      current.includes(id)
        ? current.filter((movieId) => movieId !== id)
        : [...current, id]
    )
  }

  function toggleSaved(id) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((movieId) => movieId !== id)
        : [...current, id]
    )
  }

  const navItems = [
    { label: "Overview", icon: Home },
    { label: "My Clubs", icon: Users },
    { label: "Discover", icon: Compass },
    { label: "History", icon: History },
  ]

  function MovieCard({ movie }) {
    return (
      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="aspect-[2/3] w-full bg-gray-100 object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{movie.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {movie.year} · {movie.genre}
          </p>
          <div className="mt-3 flex items-center gap-1 text-sm text-amber-600">
            <Star size={15} fill="currentColor" />
            {movie.rating.toFixed(1)}
            <span className="ml-auto text-xs text-gray-400">Sample data</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => toggleWatched(movie.id)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                watched.includes(movie.id)
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <CheckCircle2 size={14} />
              {watched.includes(movie.id) ? "Watched" : "Mark watched"}
            </button>
            <button
              onClick={() => toggleSaved(movie.id)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                saved.includes(movie.id)
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {saved.includes(movie.id) ? "In backlog" : "Add to backlog"}
            </button>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="mb-2 text-xs font-medium text-gray-500">
              Your sample rating
            </p>
            <div className="flex gap-1" aria-label={`Rate ${movie.title}`}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((current) => ({
                      ...current,
                      [movie.id]: value,
                    }))
                  }
                  aria-label={`Rate ${movie.title} ${value} out of 5`}
                  className="rounded p-0.5 transition hover:scale-110"
                >
                  <Star
                    size={19}
                    className={
                      value <= (ratings[movie.id] || 0)
                        ? "text-amber-500"
                        : "text-gray-300"
                    }
                    fill={
                      value <= (ratings[movie.id] || 0)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-gray-900">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white">
            <Film size={20} />
          </span>
          <span className="text-lg font-bold tracking-tight">Reelspin</span>
          <span className="ml-1 rounded-full bg-purple-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-700">
            Demo
          </span>
        </Link>

        <Link
          to="/login"
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          Sign in
        </Link>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white p-5 md:block">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => changeSection(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  section === label
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-xl bg-purple-50 p-4">
            <p className="text-sm font-semibold text-purple-900">
              You're exploring a demo
            </p>
            <p className="mt-2 text-xs leading-5 text-purple-800">
              Changes are temporary and reset when you refresh.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-purple-700"
            >
              <ArrowLeft size={16} />
              Back to Reelspin
            </Link>

            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Sample workspace
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  {section === "Overview"
                    ? "Your movie nights"
                    : section}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Explore the features using sample data. No account needed.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-xs font-medium text-purple-800">
                <Play size={15} />
                Interactive preview
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="mb-6 grid grid-cols-4 gap-2 md:hidden">
              {navItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => changeSection(label)}
                  className={`flex flex-col items-center gap-2 rounded-xl px-1 py-3 text-xs font-medium ${
                    section === label
                      ? "bg-purple-100 text-purple-700"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            {section === "Overview" && (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Film clubs", value: "2", icon: Users },
                    { label: "Films discovered", value: "6", icon: Compass },
                    { label: "Films watched", value: String(watched.length), icon: CheckCircle2 },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5"
                    >
                      <div>
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="mt-2 text-2xl font-bold">{value}</p>
                      </div>
                      <Icon className="text-purple-500" size={24} />
                    </div>
                  ))}
                </div>

                <div className="mb-8 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-fuchsia-50 p-6 sm:p-8">
                  <p className="text-sm font-semibold text-purple-700">
                    This week's pick
                  </p>
                  <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <img
                      src={initialMovies[0].poster}
                      alt="Interstellar poster"
                      className="w-24 rounded-xl shadow-md"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">Interstellar</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        2014 · Sci-Fi · 8.7/10
                      </p>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                        A sample club pick for an unforgettable journey
                        through space, time and the power of human connection.
                      </p>
                      <button
                        onClick={() => changeSection("Discover")}
                        className="mt-4 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
                      >
                        Explore films
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {section === "My Clubs" && (
              <div className="grid gap-5 md:grid-cols-2">
                {initialClubs.map((club) => (
                  <article
                    key={club.id}
                    className="rounded-2xl border border-gray-200 bg-white p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                      <Users size={21} />
                    </div>
                    <h2 className="mt-4 text-lg font-bold">{club.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {club.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                      <span className="text-gray-500">
                        {club.members} sample members
                      </span>
                      <span className="font-medium text-purple-700">
                        {club.nextFilm}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {section === "Discover" && (
              <div>
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4">
                  <Search size={18} className="shrink-0 text-gray-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search sample films..."
                    className="w-full bg-transparent py-3.5 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
                {movies.length === 0 && (
                  <p className="py-12 text-center text-sm text-gray-500">
                    No sample films match that search.
                  </p>
                )}
              </div>
            )}

            {section === "History" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {initialMovies
                  .filter((movie) => watched.includes(movie.id))
                  .map((movie) => (
                    <div
                      key={movie.id}
                      className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4"
                    >
                      <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        className="w-20 rounded-lg object-cover"
                      />
                      <div>
                        <h2 className="font-semibold">{movie.title}</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {movie.year} · {movie.genre}
                        </p>
                        <p className="mt-3 flex items-center gap-1 text-xs font-medium text-green-700">
                          <CheckCircle2 size={14} />
                          Marked watched
                        </p>
                      </div>
                    </div>
                  ))}
                {watched.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No films watched yet. Visit Discover to try marking one.
                  </p>
                )}
              </div>
            )}

            {notice && (
              <p className="mt-6 rounded-xl bg-purple-50 p-4 text-sm text-purple-800">
                {notice}
              </p>
            )}

            <p className="mt-10 border-t border-gray-200 pt-5 text-xs leading-5 text-gray-400">
              Portfolio preview · All clubs, ratings and film data on this
              page are examples. Changes are kept only in this browser session.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Demo
