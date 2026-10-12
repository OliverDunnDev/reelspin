import { Star, Film } from 'lucide-react'

function History() {
  const history = [
    {
      title: 'Interstellar',
      club: 'Thursday Film Club',
      date: '12 September 2026',
      rating: 5,
      poster:
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    },
    {
      title: 'The Grand Budapest Hotel',
      club: 'The Film Nerds',
      date: '5 September 2026',
      rating: 4,
      poster:
        'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    },
    {
      title: 'Parasite',
      club: 'Thursday Film Club',
      date: '29 August 2026',
      rating: 5,
      poster:
        'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    },
  ]

  return (
    <div>
      <header className="flex h-20 items-center border-b border-gray-200 bg-white px-8">
        <h1 className="text-lg font-semibold">History</h1>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-10">

        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-purple-600">
            Your watching history
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Film history
          </h2>

          <p className="mt-2 text-gray-500">
            Every film your clubs have watched together.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

          {history.map((film, index) => (
            <div
              key={film.title}
              className={`flex items-center gap-5 p-5 ${
                index !== history.length - 1
                  ? 'border-b border-gray-100'
                  : ''
              }`}
            >
              <img
                src={film.poster}
                alt={film.title}
                className="h-24 w-16 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">
                  {film.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {film.club}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {film.date}
                </p>
              </div>

              <div className="hidden items-center gap-1 rounded-xl bg-yellow-50 px-3 py-2 sm:flex">
                <Star
                  size={16}
                  fill="currentColor"
                  className="text-yellow-500"
                />

                <span className="text-sm font-semibold text-gray-700">
                  {film.rating}/5
                </span>
              </div>
            </div>
          ))}

        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Film size={16} />
          More films will appear here as your clubs watch together.
        </div>

      </main>
    </div>
  )
}

export default History