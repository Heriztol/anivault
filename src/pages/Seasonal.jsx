import { useEffect, useState } from 'react'
import { getSeasonNow, getSeasonUpcoming, getSeason } from '../api/jikan.js'
import AnimeCard from '../components/AnimeCard.jsx'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

const SEASONS = ['winter', 'spring', 'summer', 'fall']
const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const YEARS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR + 1 - i)

const TABS = ['Now Airing', 'Upcoming', 'Browse']

export default function Seasonal() {
  const [tab, setTab] = useState('Now Airing')
  const [year, setYear] = useState(CURRENT_YEAR)
  const [season, setSeason] = useState(SEASONS[Math.floor((now.getMonth() / 12) * 4) % 4])
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      let res
      if (tab === 'Now Airing') res = await getSeasonNow()
      else if (tab === 'Upcoming') res = await getSeasonUpcoming()
      else res = await getSeason(year, season)
      setList(res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, year, season])

  return (
    <div>
      <TopBar title="Seasonal" />
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                tab === t ? 'bg-accent-gradient' : 'bg-elevated text-white/60 hover:bg-elevated2'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Browse' && (
          <div className="mt-4 flex flex-wrap gap-2">
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-full border border-border bg-elevated px-3 py-1.5 text-sm">
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className="rounded-full border border-border bg-elevated px-3 py-1.5 text-sm capitalize">
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div className="mt-5">
          {loading && <LoadingSpinner label="Loading season" />}
          {!loading && error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {list.map((a) => <AnimeCard key={a.mal_id} anime={a} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
