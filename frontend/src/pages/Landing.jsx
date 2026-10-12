
import { Link, useNavigate } from "react-router-dom"
import { Film, ArrowRight, Users, Star, Compass } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Your film club",
    description: "Bring friends together and build a shared watchlist.",
  },
  {
    icon: Compass,
    title: "Discover films",
    description: "Find your next favourite film and add it to the backlog.",
  },
  {
    icon: Star,
    title: "Rate and remember",
    description: "Keep track of what you've watched and what you loved.",
  },
]

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-hidden bg-[#100E17] text-white">
      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
            <Film size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight">Reelspin</span>
        </Link>

        <Link
          to="/login"
          className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:border-white/40 hover:bg-white/5"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main>
        <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-20 text-center lg:px-10 lg:pb-32 lg:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-20 -z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-700/25 blur-[110px]" />

          <div className="relative z-10 mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-sm text-purple-200">
            <Film size={15} />
            A better way to watch together
          </div>

          <h1 className="relative z-10 max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Less scrolling.
            <span className="block bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              More movie nights.
            </span>
          </h1>

          <p className="relative z-10 mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Create film clubs, discover your next watch, and keep every
            movie night in one place. Your next favourite film starts here.
          </p>

          <div className="relative z-10 mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <button
              onClick={() => navigate("/demo")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-4 font-semibold shadow-lg shadow-purple-950/40 transition hover:-translate-y-0.5 hover:bg-purple-500"
            >
              Explore Demo
              <ArrowRight size={18} />
            </button>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-7 py-4 font-semibold text-gray-200 transition hover:bg-white/5"
            >
              Create an account
            </Link>
          </div>

          <p className="relative z-10 mt-4 text-xs text-gray-500">
            Try the interactive preview — no account required.
          </p>

          {/* Film poster-style preview */}
          <div className="relative z-10 mt-20 grid w-full max-w-4xl grid-cols-3 gap-3 sm:gap-6">
            {[
              {
                title: "Interstellar",
                year: "2014",
                image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
              },
              {
                title: "Inception",
                year: "2010",
                image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
              },
              {
                title: "Parasite",
                year: "2019",
                image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
              },
            ].map((movie) => (
              <div key={movie.title} className="group text-left">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl transition duration-300 group-hover:-translate-y-2 group-hover:border-purple-400/50">
                  <img
                    src={movie.image}
                    alt={`${movie.title} movie poster`}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </div>
                <h3 className="mt-3 text-sm font-semibold sm:text-base">
                  {movie.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">{movie.year}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/10 bg-white/[0.02] px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
                Made for movie lovers
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything for your next movie night
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-purple-400/30"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                    <Icon size={21} />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 px-6 py-7 text-center text-sm text-gray-500">
          Reelspin · Made for better movie nights.
        </footer>
      </main>
    </div>
  )
}

export default Landing
