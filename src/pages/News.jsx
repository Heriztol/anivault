import { useEffect, useState } from 'react'
import { getSeasonNow, getAnimeNews } from '../api/jikan.js'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

// Jikan has no single "global news" endpoint — news is only available per anime
// (/anime/{id}/news). To build a real news feed we pull it from a handful of
// the season's most popular airing titles and merge the results by date.
export default function News() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const season = await getSeasonNow()
      const topFew = (season.data || []).slice(0, 5)
      const newsLists = await Promise.all(
        topFew.map((a) =>
          getAnimeNews(a.mal_id)
            .then((r) => (r.data || []).map((n) => ({ ...n, animeTitle: a.title, animeId: a.mal_id })))
            .catch(() => [])
        )
      )
      const merged = newsLists
        .flat()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20)
      setItems(merged)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <TopBar title="News" />
      <div className="px-4 py-4 lg:px-6">
        <p className="mb-4 text-sm text-white/40">
          Latest news from this season's most popular airing anime.
        </p>
        {loading && <LoadingSpinner label="Loading news" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && items.length === 0 && (
          <p className="py-10 text-center text-white/40">No news found right now.</p>
        )}
        {!loading && !error && (
          <div className="flex max-w-2xl flex-col gap-3">
            {items.map((n) => (
              <a
                key={n.mal_id}
                href={n.forum_url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg bg-elevated p-4 hover:bg-elevated2"
              >
                <p className="text-xs font-medium text-accent">{n.animeTitle}</p>
                <p className="mt-1 text-sm font-semibold text-white/90">{n.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-white/50">{n.excerpt}</p>
                <p className="mt-2 text-xs text-white/30">
                  {n.date ? new Date(n.date).toLocaleDateString() : ''}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
