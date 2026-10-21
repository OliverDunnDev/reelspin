import { useEffect, useState } from 'react'
import { Search, Star, Film, Plus } from 'lucide-react'
import api from '../api'

function Discover() {
  const [query, setQuery] = useState('')
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clubs, setClubs] = useState([])
  const [selectedClubs, setSelectedClubs] = useState({})
  const [addingFilm, setAddingFilm] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [addError, setAddError] = useState('')

  useEffect(() => {
    const searchTerm = query.trim()

    if (searchTerm.length < 2) {
      setFilms([])
      setLoading(false)
      setError('')
      return
    }

    let cancelled = false

    const timeout = setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const response = await api.get('/movies/search', {
          params: { query: searchTerm },
        })

        if (!cancelled) {
          setFilms(response.data.results ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setFilms([])
          setError(
            err.response?.data?.detail ||
              'Unable to search films. Please try again.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [query])

  useEffect(() => {
  async function fetchClubs() {
    try {
      const response = await api.get('/clubs/')
      setClubs(response.data)
    } catch (err) {
      console.error('Failed to load clubs:', err)
      setAddError('Unable to load your clubs. Please try again.')
    }
  }

  fetchClubs()
}, [])

  async function handleAddFilm(film) {
  const clubId = selectedClubs[film.id]

  if (!clubId) {
    setAddError('Please select a club first.')
    return
  }

  try {
    setAddingFilm(film.id)
    setAddError('')
    setSuccessMessage('')

    await api.post(`/clubs/${clubId}/movies`, {
      movie_id: film.id,
      title: film.title,
      year: film.year ? Number(film.year) : 0,
      rating: film.rating,
      genre: null,
      poster: film.poster,
      overview: film.overview,
    })

    const club = clubs.find(
      (item) => String(item.id) === String(clubId)
    )

    setSuccessMessage(
      `${film.title} added to ${club?.name || 'your club'}.`
    )
  } catch (err) {
    setAddError(
      err.response?.data?.detail ||
        'Unable to add this film. Please try again.'
    )
  } finally {
    setAddingFilm(null)
  }
}


  async function handleAddToBacklog(film) {
    
  async function handleAddToBacklog(film) {
    const clubId = selectedClubs[film.id]

    if (!clubId) {
      setAddError('Please select a club first.')
      setSuccessMessage('')
      return
    }

    setAddingFilm(film.id)
    setAddError('')
    setSuccessMessage('')

    try {
      const response = await api.post(
        `/clubs/${clubId}/backlog`,
        {
          movie_id: film.id,
          title: film.title,
          year: film.year ? Number(film.year) : 0,
          rating: film.rating,
          genre: null,
          poster: film.poster,
          overview: film.overview,
        }
      )

      const club = clubs.find(
        (item) => String(item.id) === String(clubId)
      )

      setSuccessMessage(
        `${film.title} added to the ${club?.name || 'club'} backlog.`
      )

      console.log('Backlog film added:', response.data)
    } catch (err) {
      console.error('Failed to add film to backlog:', err)

      setAddError(
        err.response?.data?.detail ||
          err.message ||
          'Unable to add this film to the backlog. Please try again.'
      )
    } finally {
      setAddingFilm(null)
    }
  }

  }


  return (
    <div>
      <header className="flex h-20 items-center border-b border-gray-200 bg-white px-8">
        <h1 className="text-lg font-semibold">Discover</h1>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-purple-600">
            Find your next favourite
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Discover films
          </h2>

          <p className="mt-2 text-gray-500">
            Search films to inspire your next club pick.
          </p>
        </div>

        <div className="mb-10 max-w-2xl">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for a film..."
              aria-label="Search for a film"
              className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />
          </div>
        </div>

        <section>
          {addError && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {addError}
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {successMessage}
            </div>
          )}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {query.trim().length >= 2 ? 'Search results' : 'Find a film'}
            </h3>
          </div>

          {loading && (
            <p className="py-8 text-sm text-gray-500" role="status">
              Searching films...
            </p>
          )}

          {!loading && error && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {!loading && !error && query.trim().length < 2 && (
            <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
              <Search className="mx-auto mb-3 text-gray-400" size={28} />
              <p className="font-medium text-gray-700">
                Search for your next film
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Enter at least two characters to see matching films.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            query.trim().length >= 2 &&
            films.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
                <Film className="mx-auto mb-3 text-gray-400" size={28} />
                <p className="font-medium text-gray-700">
                  No films found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try another title or check your spelling.
                </p>
              </div>
            )}

          {!loading && !error && films.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {films.map((film) => (
                <div
                  key={film.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {film.poster ? (
                    <img
                      src={film.poster}
                      alt={`${film.title} poster`}
                      loading="lazy"
                      className="h-80 w-full bg-gray-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-80 w-full flex-col items-center justify-center gap-3 bg-gray-100 text-gray-400">
                      <Film size={40} />
                      <span className="text-sm">No poster available</span>
                    </div>
                  )}

                  <div className="p-5">
                    <h4 className="font-semibold text-gray-900">
                      {film.title}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                      {film.year || 'Release year unknown'}
                    </p>

                    {film.overview && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {film.overview}
                      </p>
                    )}

                    {typeof film.rating === 'number' && (
                      <div className="mt-4 flex items-center gap-1 text-sm">
                        <Star
                          size={16}
                          fill="currentColor"
                          className="text-yellow-500"
                        />

                        <span className="font-semibold">
                          {film.rating.toFixed(1)}
                        </span>

                        <span className="text-gray-400">/ 10</span>
                      </div>
                    )}
                    <div className="mt-5 border-t border-gray-100 pt-4">
                      {clubs.length > 0 ? (
                        <>
                          <label
                            htmlFor={`club-${film.id}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Add to club
                          </label>

                          <select
                            id={`club-${film.id}`}
                            value={selectedClubs[film.id] || ''}
                            onChange={(event) =>
                              setSelectedClubs((current) => ({
                                ...current,
                                [film.id]: event.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                          >
                            <option value="">Choose a club...</option>
                            {clubs.map((club) => (
                              <option key={club.id} value={club.id}>
                                {club.name}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleAddFilm(film)}
                            disabled={addingFilm === film.id}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Plus size={16} />
                            {addingFilm === film.id ? 'Adding film...' : 'Add to club'}
                          </button>  
                         
                          <button
                            type="button"
                            onClick={() => handleAddToBacklog(film)}
                            disabled={addingFilm === film.id}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 px-4 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Plus size={16} />
                            {addingFilm === film.id ? 'Adding film...' : 'Add to backlog'}
                          </button>

                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Create or join a club before adding films.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Discover
