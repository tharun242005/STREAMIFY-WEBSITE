export default function MovieCard({ movie }) {
  const rating =
    movie?.imdbRating == null ? null : Number(movie.imdbRating).toFixed(1)

  return (
    <article className="group overflow-hidden rounded-2xl border border-(--border) bg-(--surface)/80 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(0,0,0,0.5)]">
      <div className="relative aspect-2/3 w-full overflow-hidden bg-(--surface-2)">
        {movie?.poster ? (
          <img
            src={movie.poster}
            alt={movie?.title || 'Movie poster'}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-(--muted)">
            No poster available
          </div>
        )}

        {rating ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-(--accent-2)" />
            {rating}
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <div className="mb-1 text-base font-semibold text-(--text)">
          {movie?.title || 'Untitled'}
        </div>
        <div className="mb-3 text-sm text-(--muted)">
          {movie?.year ? <span>{movie.year}</span> : <span>—</span>}
          {movie?.runtime ? <span className="mx-2 opacity-50">•</span> : null}
          {movie?.runtime ? <span>{movie.runtime}</span> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {(movie?.genres || []).slice(0, 3).map((g) => (
            <span
              key={g}
              className="rounded-full border border-(--border) bg-(--surface-2) px-3 py-1 text-xs font-medium text-(--muted)"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

