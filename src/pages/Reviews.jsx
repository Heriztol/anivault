import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopAnime, getAnimeReviews } from '../api/jikan.js'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

export default function Reviews() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const top = await getTopAnime({ filter: 'bypopularity' })
      const topFew = (top.data || []).slice(0, 4)
      const reviewLists = await Promise.all(
        topFew.map((a) =>
          getAnimeReviews(a.mal_id)
            .then((r) => (r.data || []).slice(0, 3).map((rv) => ({ ...rv, anime: a })))
            .catch(() => [])
        )
      )
      setItems(reviewLists.flat())
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
      <TopBar title="Reviews" showBack />
      <div className="px-4 py-4 lg:px-6">
        <p className="mb-4 text-sm text-white/40">Community reviews from currently popular anime.</p>
        {loading && <LoadingSpinner label="Loading reviews" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}
        <div className="flex max-w-2xl flex-col gap-4">
          {items.map((rv) => (
            <Link key={rv.mal_id} to={`/anime/${rv.anime.mal_id}`} className="block rounded-lg bg-elevated p-4 hover:bg-elevated2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-medium text-accent">{rv.anime.title}</p>
                <span className="text-xs text-star">★ {rv.score}</span>
              </div>
              <p className="text-sm font-semibold text-white/80">{rv.user?.username}</p>
              <p className="line-clamp-3 mt-1 text-sm text-white/50">{rv.review}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
