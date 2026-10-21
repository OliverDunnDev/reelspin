import { useEffect, useState } from "react"
import api from "../api"
import { Plus, Users, ArrowRight, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Clubs() {
  const [clubs, setClubs] = useState([])
  const [clubDetails, setClubDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [clubName, setClubName] = useState("")
  const [creatingClub, setCreatingClub] = useState(false)
  const [createError, setCreateError] = useState("")

  const navigate = useNavigate()

  
async function fetchClubDetails(clubList) {
  const entries = await Promise.all(
    clubList.map(async (club) => {
      let memberCount = 0
      let currentMovie = null

      try {
        const membersResponse = await api.get(
          `/clubs/${club.id}/members`
        )
        memberCount = membersResponse.data.length
      } catch (error) {
        console.error(
          `Failed to fetch members for club ${club.id}:`,
          error.response?.data || error
        )
      }

      try {
        const movieResponse = await api.get(
          `/clubs/${club.id}/movies`
        )
        currentMovie = movieResponse.data
      } catch (error) {
        console.error(
          `Failed to fetch current film for club ${club.id}:`,
          error.response?.data || error
        )
      }

      return [
        club.id,
        { memberCount, currentMovie },
      ]
    })
  )

  setClubDetails((currentDetails) => ({
  ...currentDetails,
  ...Object.fromEntries(entries),
}))
}


  async function handleCreateClub(event) {
    event.preventDefault()

    if (!clubName.trim()) {
      setCreateError("Please enter a club name.")
      return
    }

    try {
      setCreatingClub(true)
      setCreateError("")

      const response = await api.post("/clubs/", {
        name: clubName.trim(),
      })

      setClubs((currentClubs) => [
        ...currentClubs,
        response.data,
      ])
      await fetchClubDetails([response.data])

      setClubName("")
      setShowCreateModal(false)
    } catch (error) {
      console.error("Failed to create club:", error)

      setCreateError(
        error.response?.data?.detail ||
        "Unable to create club. Please try again."
      )
    } finally {
      setCreatingClub(false)
    }
  }

  useEffect(() => {
    async function fetchClubs() {
      try {
        const response = await api.get("/clubs/")

        console.log("Clubs API response:", response.data)

        setClubs(response.data)
        await fetchClubDetails(response.data)
      } catch (error) {
        console.error("Failed to fetch clubs:", error)
        setError("Unable to load your clubs.")
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  return (
    <div>
      {/* Header */}
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
        <div>
          <h1 className="text-lg font-semibold">My Clubs</h1>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true)
            setCreateError("")
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          <Plus size={17} />
          Create club
        </button>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-8 py-10">

        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-purple-600">
            Your film community
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Your film clubs
          </h2>

          <p className="mt-2 text-gray-500">
            Keep track of what your friends are watching together.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-gray-500">
            Loading your clubs...
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {clubs.map((club) => (
            <div
              key={club.id}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
            >
              <div className="mb-6 flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Users size={22} />
                </div>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                  Your club
                </span>

              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {club.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {clubDetails[club.id]?.memberCount ?? "—"}{" "}
                {(clubDetails[club.id]?.memberCount ?? 0) === 1
                  ? "member"
                  : "members"}
              </p>

              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Up next
                </p>

                
                <p className="mt-1 font-semibold text-gray-800">
                  {clubDetails[club.id]?.currentMovie?.title ||
                    "No film selected"}
                </p>

                {clubDetails[club.id]?.currentMovie?.year && (
                  <p className="mt-1 text-sm text-gray-500">
                    {clubDetails[club.id].currentMovie.year}
                  </p>
                )}

              </div>

              <button
                onClick={() => navigate(`/clubs/${club.id}`)}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-purple-600 transition group-hover:gap-3"
              >
                View club
                <ArrowRight size={16} />
              </button>

            </div>
          ))}

        </div>
      </main>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create a club
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Start a new film community.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClub}>
              <label
                htmlFor="clubName"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Club name
              </label>

              <input
                id="clubName"
                type="text"
                value={clubName}
                onChange={(event) => setClubName(event.target.value)}
                placeholder="e.g. Thursday Film Club"
                maxLength={100}
                autoFocus
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              {createError && (
                <p className="mt-2 text-sm text-red-600">
                  {createError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingClub}
                  className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingClub ? "Creating..." : "Create club"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clubs