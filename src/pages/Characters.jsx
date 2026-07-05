import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopCharacters } from '../api/jikan.js'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

export default function Characters() {
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await getTopCharacters({ page })
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
  }, [page])

  return (
    <div>
      <TopBar title="Characters" />
      <div className="px-4 py-4 lg:px-6">
        {loading && <LoadingSpinner label="Loading characters" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {list.map((c) => (
              <Link key={c.mal_id} to={`/characters/${c.mal_id}`} className="text-center">
                <img src={c.images?.jpg?.image_url} alt={c.name} className="aspect-square w-full rounded-lg object-cover" loading="lazy" />
                <p className="mt-1.5 line-clamp-2 text-xs font-medium text-white/80">{c.name}</p>
                <p className="text-[11px] text-white/40">❤ {c.favorites?.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full bg-elevated px-4 py-1.5 text-sm disabled:opacity-30">Prev</button>
          <span className="py-1.5 text-sm text-white/50">Page {page}</span>
          <button disabled={!hasNext} onClick={() => setPage((p) => p + 1)} className="rounded-full bg-elevated px-4 py-1.5 text-sm disabled:opacity-30">Next</button>
        </div>
      </div>
    </div>
  )
}
