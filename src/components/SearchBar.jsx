import { useState } from 'react'

export default function SearchBar({ onSearch, disabled }) {
  const [title, setTitle] = useState('')
  const [minRating, setMinRating] = useState('')
  const [genre, setGenre] = useState('')

  function submit(e) {
    e.preventDefault()
    onSearch?.({ title, minRating, genre })
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-(--border) bg-(--surface)/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <label className="flex-1">
          <div className="mb-1 text-sm font-medium text-(--muted)">
            Title
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Inception"
            disabled={disabled}
            className="w-full rounded-xl border border-(--border) bg-(--surface-2) px-4 py-3 text-(--text) outline-none ring-0 placeholder:text-(--muted) focus:border-(--accent)/60 focus:outline-none"
          />
        </label>

        <label className="md:w-44">
          <div className="mb-1 text-sm font-medium text-(--muted)">
            Min rating
          </div>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            disabled={disabled}
            className="w-full rounded-xl border border-(--border) bg-(--surface-2) px-4 py-3 text-(--text) outline-none focus:border-(--accent)/60"
          >
            <option value="">Any</option>
            <option value="9">9+</option>
            <option value="8">8+</option>
            <option value="7">7+</option>
            <option value="6">6+</option>
            <option value="5">5+</option>
          </select>
        </label>

        <label className="md:w-56">
          <div className="mb-1 text-sm font-medium text-(--muted)">
            Genre
          </div>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Sci-Fi"
            disabled={disabled}
            className="w-full rounded-xl border border-(--border) bg-(--surface-2) px-4 py-3 text-(--text) outline-none placeholder:text-(--muted) focus:border-(--accent)/60"
          />
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--accent) to-(--accent-2) px-5 py-3 font-semibold text-black shadow-[0_12px_28px_rgba(139,92,246,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Search
          <span className="text-black/60 transition group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>
    </form>
  )
}

