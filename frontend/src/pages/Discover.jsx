import { Search, Star } from 'lucide-react'

function Discover() {
  const films = [
    {
      title: 'Interstellar',
      year: 2014,
      rating: 8.7,
      genre: 'Science Fiction',
      poster:
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    },
    {
      title: 'Inception',
      year: 2010,
      rating: 8.4,
      genre: 'Science Fiction',
      poster:
        'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    },
    {
      title: 'Parasite',
      year: 2019,
      rating: 8.5,
      genre: 'Thriller',
      poster:
        'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    },
  ]

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
            Browse films to inspire your next club pick.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 max-w-2xl">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search for a film..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />
          </div>
        </div>

        <section>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Popular right now
            </h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {films.map((film) => (
              <div
                key={film.title}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={film.poster}
                  alt={film.title}
                  className="h-80 w-full object-cover"
                />

                <div className="p-5">
                  <h4 className="font-semibold text-gray-900">
                    {film.title}
                  </h4>

                  <p className="mt-1 text-sm text-gray-500">
                    {film.year} · {film.genre}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm">
                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-500"
                    />

                    <span className="font-semibold">
                      {film.rating}
                    </span>

                    <span className="text-gray-400">
                      / 10
                    </span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>

      </main>
    </div>
  )
}

export default Discover