import { Star } from "lucide-react"

function MovieCard({ movie, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(movie)}
      className="group flex w-full gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:-translate-y-1 hover:border-purple-400 hover:shadow-md"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="h-32 w-24 rounded-xl object-cover"
      />

      <div className="flex flex-1 flex-col">
        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
          {movie.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {movie.year} · {movie.genre}
        </p>

        <div className="mt-2 flex items-center gap-1 text-sm text-yellow-500">
          <Star size={15} fill="currentColor" />
          <span>{movie.rating}</span>
        </div>

        <p className="mt-auto text-sm font-medium text-purple-600">
          Select movie →
        </p>
      </div>
    </button>
  )
}

export default MovieCard