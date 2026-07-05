import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopManga, searchManga, getMangaGenres } from '../api/jikan.js'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

export default function Manga() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMangaGenres().then((r) => setGenres(r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => load(), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      let res
      if (query.trim() || genre) {
        res = await searchManga({ q: query.trim(), genres: genre, order_by: query ? '' : 'popularity' })
      } else {
        res = await getTopManga()
      }
      setList(res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <TopBar title="Manga" />
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manga…"
            className="min-w-[200px] flex-1 rounded-full border border-border bg-elevated px-4 py-2 text-sm placeholder-white/40 focus:border-accent focus:outline-none"
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-full border border-border bg-elevated px-3 py-2 text-sm text-white/70 focus:outline-none"
          >
            <option value="">All Genres</option>
            {genres.map((g) => <option key={g.mal_id} value={g.mal_id}>{g.name}</option>)}
          </select>
        </div>

        <div className="mt-5">
          {loading && <LoadingSpinner label="Loading manga" />}
          {!loading && error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {list.map((m) => (
                <Link key={m.mal_id} to={`/manga/${m.mal_id}`} className="block overflow-hidden rounded-xl bg-elevated shadow-card">
                  <div className="aspect-[2/3] w-full overflow-hidden">
                    <img src={m.images?.jpg?.large_image_url} alt={m.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-sm font-medium">{m.title}</p>
                    {m.score ? <p className="mt-0.5 text-xs text-white/50">★ {m.score}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
