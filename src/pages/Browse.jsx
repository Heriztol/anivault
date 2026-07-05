import { useEffect, useState } from 'react'
import { getGenres, getStudios, searchAnime } from '../api/jikan.js'
import AnimeCard from '../components/AnimeCard.jsx'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

export default function Browse() {
  const [mode, setMode] = useState('genre')
  const [genres, setGenres] = useState([])
  const [studios, setStudios] = useState([])
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [results, setResults] = useState([])
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getGenres().then((r) => setGenres(r.data || [])).catch(() => {})
    getStudios().then((r) => setStudios(r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selected) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, page])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const params = mode === 'genre'
        ? { genres: selected.mal_id, page, order_by: 'popularity' }
        : { page, order_by: 'popularity' }
      // Jikan doesn't filter by producer/studio id directly in /anime search on all setups,
      // so for studio mode we filter client-side by name from a popularity-sorted page.
      const res = await searchAnime(params)
      let data = res.data || []
      if (mode === 'studio') {
        data = data.filter((a) => a.studios?.some((s) => s.mal_id === selected.mal_id))
      }
      setResults(data)
      setHasNext(res.pagination?.has_next_page || false)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function choose(mode2, item) {
    setMode(mode2)
    setSelected(item)
    setPage(1)
    setResults([])
  }

  return (
    <div>
      <TopBar title="Browse" />
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="lg:w-64 lg:shrink-0">
            <h3 className="mb-2 text-sm font-semibold text-white/50">Genres</h3>
            <div className="flex flex-wrap gap-1.5 lg:flex-col">
              {genres.map((g) => (
                <button
                  key={g.mal_id}
                  onClick={() => choose('genre', g)}
                  className={`rounded-full px-3 py-1.5 text-left text-xs font-medium lg:rounded-lg ${
                    selected?.mal_id === g.mal_id && mode === 'genre'
                      ? 'bg-accent-gradient'
                      : 'bg-elevated text-white/60 hover:bg-elevated2'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            <h3 className="mb-2 mt-6 text-sm font-semibold text-white/50">Studios</h3>
            <div className="flex flex-wrap gap-1.5 lg:flex-col">
              {studios.slice(0, 20).map((s) => (
                <button
                  key={s.mal_id}
                  onClick={() => choose('studio', s)}
                  className={`rounded-full px-3 py-1.5 text-left text-xs font-medium lg:rounded-lg ${
                    selected?.mal_id === s.mal_id && mode === 'studio'
                      ? 'bg-accent-gradient'
                      : 'bg-elevated text-white/60 hover:bg-elevated2'
                  }`}
                >
                  {s.titles?.[0]?.title || s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {!selected && <p className="py-10 text-center text-white/40">Pick a genre or studio to browse.</p>}
            {loading && <LoadingSpinner label="Loading titles" />}
            {!loading && error && <ErrorState message={error} onRetry={load} />}
            {!loading && !error && selected && (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {results.map((a) => <AnimeCard key={a.mal_id} anime={a} />)}
                </div>
                {results.length === 0 && <p className="py-10 text-center text-white/40">No titles found.</p>}
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-full bg-elevated px-4 py-1.5 text-sm disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <span className="py-1.5 text-sm text-white/50">Page {page}</span>
                  <button
                    disabled={!hasNext}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full bg-elevated px-4 py-1.5 text-sm disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
