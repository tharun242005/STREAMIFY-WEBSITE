import axios from 'axios'

const OMDB_BASE_URL = 'https://www.omdbapi.com/'

function getApiKey() {
  const key = import.meta.env?.VITE_OMDB_API_KEY
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    const err = new Error(
      'Missing OMDb API key. Add VITE_OMDB_API_KEY to a local .env file and restart the dev server.',
    )
    err.code = 'MISSING_API_KEY'
    throw err
  }
  return key.trim()
}

function toServiceError(error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status
      const message =
        error.response.data?.Error ||
        error.response.data?.message ||
        `Request failed with status ${status}`
      const err = new Error(message)
      err.code = 'HTTP_ERROR'
      err.status = status
      return err
    }
    if (error.request) {
      const err = new Error('Network error. Check your connection and try again.')
      err.code = 'NETWORK_ERROR'
      return err
    }
  }

  const err = new Error(error?.message || 'Unexpected error')
  err.code = 'UNKNOWN_ERROR'
  return err
}

function parseRating(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function normalizeMovie(details) {
  const rating = parseRating(details?.imdbRating)
  const genres =
    typeof details?.Genre === 'string'
      ? details.Genre.split(',').map((g) => g.trim()).filter(Boolean)
      : []

  return {
    id: details?.imdbID,
    title: details?.Title || 'Untitled',
    year: details?.Year || '',
    poster:
      details?.Poster && details.Poster !== 'N/A' ? details.Poster : null,
    imdbRating: rating,
    genres,
    runtime: details?.Runtime && details.Runtime !== 'N/A' ? details.Runtime : null,
  }
}

async function omdbGet(params) {
  const apikey = getApiKey()
  const res = await axios.get(OMDB_BASE_URL, {
    params: { apikey, ...params },
    timeout: 15000,
  })
  return res.data
}

async function fetchMovieDetails(imdbID) {
  const data = await omdbGet({ i: imdbID, plot: 'short' })
  if (data?.Response === 'False') {
    const err = new Error(data?.Error || 'Movie not found')
    err.code = 'OMDB_ERROR'
    throw err
  }
  return normalizeMovie(data)
}

function passesRating(movie, minRating) {
  if (minRating == null) return true
  if (movie.imdbRating == null) return false
  return movie.imdbRating >= minRating
}

function passesGenre(movie, genre) {
  if (!genre) return true
  const needle = genre.trim().toLowerCase()
  if (!needle) return true
  return movie.genres.some((g) => g.toLowerCase().includes(needle))
}

/**
 * Search for movies by title, then apply rating/genre filters.
 * OMDb does not support rating/genre server-side filtering, so we fetch details
 * for each match and filter client-side.
 */
export async function searchMovies({ title, minRating, genre }) {
  try {
    const q = (title || '').trim()
    if (!q) {
      const err = new Error('Enter a movie title to search.')
      err.code = 'VALIDATION_ERROR'
      throw err
    }

    const data = await omdbGet({ s: q, type: 'movie', page: 1 })
    if (data?.Response === 'False') {
      const err = new Error(data?.Error || 'No results found.')
      err.code = 'OMDB_ERROR'
      throw err
    }

    const idsRaw = Array.isArray(data?.Search)
      ? data.Search.map((m) => m?.imdbID).filter(Boolean)
      : []

    // OMDb occasionally returns duplicates; ensure stable, unique render keys.
    const ids = Array.from(new Set(idsRaw))

    const details = await Promise.all(ids.map((id) => fetchMovieDetails(id)))

    const min = minRating == null || minRating === ''
      ? null
      : parseRating(minRating)

    return details
      .filter((m) => passesRating(m, min))
      .filter((m) => passesGenre(m, genre))
  } catch (e) {
    throw toServiceError(e)
  }
}

