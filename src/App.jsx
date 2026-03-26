import { useMemo, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import MovieList from './components/MovieList.jsx'
import { searchMovies } from './services/movieService.js'

function StreamifyLogo() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      aria-hidden="true"
      className="shrink-0 drop-shadow-[0_18px_40px_rgba(139,92,246,0.25)]"
    >
      <defs>
        <linearGradient id="sf_g" x1="8" y1="6" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
        <filter id="sf_glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .35 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="3" y="3" width="38" height="38" rx="14" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.10)" />
      <g filter="url(#sf_glow)">
        <path
          d="M12 28.5c5.4-8.6 14.2-13.6 20-12.9"
          fill="none"
          stroke="url(#sf_g)"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <path
          d="M14.2 17.8c3.3-1.8 7.1-2.7 10.7-2.4"
          fill="none"
          stroke="url(#sf_g)"
          strokeWidth="3.6"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="31.6" cy="15.6" r="2.4" fill="url(#sf_g)" />
      </g>
    </svg>
  )
}

function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
      {message}
    </div>
  )
}

function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--surface)/70 p-4 text-sm text-(--muted) backdrop-blur">
      <div className="h-3 w-3 animate-pulse rounded-full bg-(--accent-2)" />
      Fetching movies…
    </div>
  )
}

function EmptyState({ hasSearched }) {
  if (!hasSearched) return null
  return (
    <div className="rounded-2xl border border-(--border) bg-(--surface)/70 p-10 text-center backdrop-blur">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-linear-to-br from-(--accent)/30 to-(--accent-2)/25" />
      <div className="text-base font-semibold text-(--text)">
        No results found
      </div>
      <div className="mt-1 text-sm text-(--muted)">
        Try a different title, lower the rating filter, or broaden the genre.
      </div>
    </div>
  )
}

export default function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const stats = useMemo(() => {
    const rated = movies.filter((m) => m.imdbRating != null)
    const avg =
      rated.length === 0
        ? null
        : rated.reduce((sum, m) => sum + m.imdbRating, 0) / rated.length
    return {
      count: movies.length,
      avgRating: avg == null ? null : avg.toFixed(1),
    }
  }, [movies])

  async function handleSearch(params) {
    setHasSearched(true)
    setError('')
    setLoading(true)
    setMovies([])

    try {
      const results = await searchMovies(params)
      setMovies(results)
      if (!results || results.length === 0) setError('')
    } catch (e) {
      setError(e?.message || 'Something went wrong while searching.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-3">
              <StreamifyLogo />
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-(--text) md:text-4xl">
                  Streamify
                </h1>
                <p className="mt-1 text-sm text-(--muted)">
                  Search films by title, then refine by rating and genre.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-(--muted)">
            <span className="rounded-full border border-(--border) bg-(--surface)/60 px-3 py-1 backdrop-blur">
              Results: <span className="text-(--text)">{stats.count}</span>
            </span>
            <span className="rounded-full border border-(--border) bg-(--surface)/60 px-3 py-1 backdrop-blur">
              Avg rating:{' '}
              <span className="text-(--text)">
                {stats.avgRating ?? '—'}
              </span>
            </span>
          </div>
        </header>

        <SearchBar onSearch={handleSearch} disabled={loading} />

        <ErrorBanner message={error} />
        {loading ? <LoadingIndicator /> : null}
        {!loading && !error && movies.length === 0 ? (
          <EmptyState hasSearched={hasSearched} />
        ) : null}

        <MovieList movies={movies} />

        <footer className="pt-6 text-xs text-(--muted)">
          Data provided by OMDb. Set <code className="rounded bg-black/30 px-2 py-1">VITE_OMDB_API_KEY</code>{' '}
          in <code className="rounded bg-black/30 px-2 py-1">.env</code>.
        </footer>
        <footer className="pt-6 text-xs text-(--muted)">
          Prototype By Tharun.P <code className="rounded bg-black/30 px-2 py-1">run40081@gmail.com</code>
        </footer>
      </div>
    </div>
  )
}
