import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopAnime } from '../api/jikan.js'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

const CHARTS = [
  { key: '', label: 'Top Rated' },
  { key: 'bypopularity', label: 'Most Popular' },
  { key: 'favorite', label: 'Most Favorited' },
  { key: 'airing', label: 'Top Airing' },
  { key: 'upcoming', label: 'Top Upcoming' },
  { key: 'movie', label: 'Top Movies' },
]

export default function Rankings() {
  const [chart, setChart] = useState('')
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await getTopAnime({ page, filter: chart })
      setList(res.data || [])
      setHasNext(res.pagination?.has_next_page || false)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, page])

  return (
    <div>
      <TopBar title="Rankings" />
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {CHARTS.map((c) => (
            <button
              key={c.key || 'top'}
              onClick={() => { setChart(c.key); setPage(1) }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                chart === c.key ? 'bg-accent-gradient' : 'bg-elevated text-white/60 hover:bg-elevated2'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {loading && <LoadingSpinner label="Loading chart" />}
          {!loading && error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && (
            <div className="flex flex-col divide-y divide-border">
              {list.map((a, i) => (
                <Link
                  key={a.mal_id}
                  to={`/anime/${a.mal_id}`}
                  className="flex items-center gap-4 py-3 hover:bg-elevated/50"
                >
                  <span className="w-8 shrink-0 text-center font-display text-lg font-bold text-white/30">
                    {(page - 1) * 25 + i + 1}
                  </span>
                  <img src={a.images?.jpg?.image_url} alt="" className="h-16 w-11 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-white/40">{a.type} · {a.episodes || '?'} eps</p>
                  </div>
                  {a.score ? (
                    <span className="shrink-0 text-sm font-semibold text-star">★ {a.score}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-5 flex justify-center gap-3">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full bg-elevated px-4 py-1.5 text-sm disabled:opacity-30">Prev</button>
            <span className="py-1.5 text-sm text-white/50">Page {page}</span>
            <button disabled={!hasNext} onClick={() => setPage((p) => p + 1)} className="rounded-full bg-elevated px-4 py-1.5 text-sm disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
