import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchAnime, getGenres } from '../api/jikan.js'
import AnimeCard from '../components/AnimeCard.jsx'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

const TYPES = ['', 'tv', 'movie', 'ova', 'ona', 'special']

export default function Search() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [type, setType] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    getGenres().then((r) => setGenres(r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(), 450)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, genre])

  async function runSearch() {
    if (!query.trim() && !genre && !type) {
      setResults([])
      return
    }
    setLoading(true)
    setError(null)
    setParams(query ? { q: query } : {})
    try {
      const res = await searchAnime({ q: query.trim(), type, genres: genre, order_by: query ? '' : 'popularity' })
      setResults(res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <TopBar title="Search" />
      <div className="px-4 py-4 lg:px-6">
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime, character, studio…"
          className="w-full rounded-full border border-border bg-elevated px-4 py-2.5 text-sm placeholder-white/40 focus:border-accent focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t || 'all'}
              onClick={() => setType(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                type === t ? 'bg-accent-gradient' : 'bg-elevated text-white/60 hover:bg-elevated2'
              }`}
            >
              {t || 'All'}
            </button>
          ))}
          {genres.length > 0 && (
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-white/70 focus:outline-none"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.mal_id} value={g.mal_id}>{g.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner label="Searching" />}
          {!loading && error && <ErrorState message={error} onRetry={runSearch} />}
          {!loading && !error && results.length === 0 && (query || genre) && (
            <p className="py-10 text-center text-white/40">No results found. Try a different search.</p>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((a) => (
                <AnimeCard key={a.mal_id} anime={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
