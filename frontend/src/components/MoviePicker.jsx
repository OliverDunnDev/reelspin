import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import movies from '../data/movies'
import MovieCard from './MovieCard'

function MoviePicker({ onClose, onSelect }) {
  const [search, setSearch] = useState('')

  const filteredMovies = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return movies
    }

    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(query)
    )
  }, [search])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Pick a movie
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose this week's film for your club.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>

        </div>

        {/* Search */}
        <div className="border-b border-gray-100 p-6">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for a film..."
              autoFocus
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />

          </div>

        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto p-6">

          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {search ? 'Search results' : 'Popular films'}
            </p>
          </div>
          <p className="text-sm text-red-500">
            Movies found: {filteredMovies.length}
          </p>
          <div className="space-y-3">

            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={onSelect}
              />
            ))}

          </div>

          {filteredMovies.length === 0 && (
            <div className="py-12 text-center">

              <p className="font-medium text-gray-700">
                No films found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try searching for something else.
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default MoviePicker