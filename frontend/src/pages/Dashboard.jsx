import { Bell, Plus } from 'lucide-react'
import MoviePicker from '../components/MoviePicker'
import { useEffect, useState } from "react"
import api from "../api"

function Dashboard() {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie)
    setIsPickerOpen(false)
  }

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await api.get("/users/me")
        setCurrentUser(response.data)
      } catch (error) {
        console.error("Failed to fetch current user:", error)
      }
    }

    fetchCurrentUser()
  }, [])

  return (
    <div>
      {/* Header */}
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
        <div>
          <h1 className="text-lg font-semibold">
            Dashboard
          </h1>
        </div>

        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
        </button>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-8 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-purple-600">
            Welcome back{currentUser ? `, ${currentUser.username}` : ""}
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ready for your next film?
          </h2>

          <p className="mt-2 text-gray-500">
            See what your film clubs are watching this week.
          </p>
        </div>

        {/* Current Pick */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              This week's pick
            </h3>
          </div>

          <div className="overflow-hidden rounded-3xl bg-purple-600 p-8 text-white shadow-sm">

            <div className="flex flex-col gap-8 md:flex-row md:items-center">

              {/* Movie poster - only appears after selecting a movie */}
              {selectedMovie && (
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="h-64 w-44 rounded-2xl object-cover shadow-xl"
                />
              )}

              <div className="max-w-xl">

                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  Thursday Film Club
                </span>

                <h3 className="mt-5 text-3xl font-bold">
                  {selectedMovie
                    ? selectedMovie.title
                    : 'Your turn to pick'}
                </h3>

                <p className="mt-3 leading-relaxed text-purple-100">
                  {selectedMovie
                    ? selectedMovie.overview
                    : "Choose a movie for your club and add it to this week's Reelspin."}
                </p>

                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                >
                  <Plus size={18} />

                  {selectedMovie
                    ? 'Change movie'
                    : 'Pick a movie'}
                </button>

              </div>

            </div>

          </div>
        </section>

        {/* Clubs */}
        <section>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Your film clubs
            </h3>

            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View all
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <ClubPlaceholder
              name="Thursday Film Club"
              members="6 members"
            />

            <ClubPlaceholder
              name="The Film Nerds"
              members="4 members"
            />

            <ClubPlaceholder
              name="Oscar Club"
              members="8 members"
            />

          </div>

        </section>

      </div>

      {/* Movie Picker Modal */}
      {isPickerOpen && (
        <MoviePicker
          onClose={() => setIsPickerOpen(false)}
          onSelect={handleMovieSelect}
        />
      )}

    </div>
  )
}

function ClubPlaceholder({ name, members }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        🎬
      </div>

      <h4 className="font-semibold">
        {name}
      </h4>

      <p className="mt-1 text-sm text-gray-500">
        {members}
      </p>

    </div>
  )
}

export default Dashboard