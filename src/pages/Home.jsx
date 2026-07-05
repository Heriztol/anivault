import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopAnime, getSeasonNow, getSeasonUpcoming, searchAnime } from '../api/jikan.js'
import { useMyList } from '../context/MyListContext.jsx'
import AnimeCard from '../components/AnimeCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

export default function Home() {
  const [trending, setTrending] = useState(null)
  const [airing, setAiring] = useState([])
  const [popular, setPopular] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [topRated, setTopRated] = useState([])
  const [justAdded, setJustAdded] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { entries, upsert } = useMyList()

  const continueWatching = entries.filter((e) => e.status === 'watching').slice(0, 6)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [popularRes, airingRes, upcomingRes, topRatedRes, justAddedRes] = await Promise.all([
        getTopAnime({ filter: 'bypopularity' }),
        getSeasonNow(),
        getSeasonUpcoming(),
        getTopAnime(),
        searchAnime({ order_by: 'start_date', sort: 'desc' }),
      ])
      setTrending(popularRes.data?.[0])
      setPopular(popularRes.data?.slice(1, 13) || [])
      setAiring(airingRes.data?.slice(0, 12) || [])
      setUpcoming(upcomingRes.data?.slice(0, 12) || [])
      setTopRated(topRatedRes.data?.slice(0, 12) || [])
      setJustAdded(justAddedRes.data?.slice(0, 12) || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Loading AniVault" />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <TopBar title="Home" />

      <div className="hidden items-center gap-3 border-b border-border px-6 py-4 lg:flex">
        <input
          type="search"
          placeholder="Search anime, manga, character…"
          className="w-full max-w-md rounded-full border border-border bg-elevated px-4 py-2 text-sm text-white placeholder-white/40 focus:border-accent focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`
            }
          }}
        />
      </div>

      <div className="px-4 py-4 lg:px-6">
        {trending ? (
          <section className="mb-8">
            <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-orange-400">
              🔥 Trending Today
            </p>
            <Link
              to={`/anime/${trending.mal_id}`}
              className="relative block overflow-hidden rounded-2xl bg-hero-gradient shadow-card"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.35),transparent_55%)]" />
              <div className="relative flex min-h-[220px] items-end gap-4 p-6">
                <div>
                  <h2 className="font-display text-2xl font-bold sm:text-3xl">{trending.title}</h2>
                  {trending.score ? (
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                      <span className="text-star">★</span> {trending.score}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={trending.trailer?.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-accent-gradient px-4 py-2 text-sm font-semibold shadow-glow"
                    >
                      ▶ Watch Trailer
                    </a>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        upsert(trending, 'plan_to_watch')
                      }}
                      className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/20"
                    >
                      + Add to List
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        ) : null}

        {continueWatching.length > 0 && (
          <section className="mb-8">
            <SectionHeader title="Continue Watching" to="/mylist" />
            <div className="rail -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
              {continueWatching.map((e) => (
                <div key={e.mal_id} className="w-32 shrink-0 sm:w-36">
                  <AnimeCard
                    anime={{ mal_id: e.mal_id, title: e.title, images: { jpg: { image_url: e.image, large_image_url: e.image } } }}
                    subtitle={e.episodes ? `Ep. ${e.progress}/${e.episodes}` : `Ep. ${e.progress}`}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <Rail title="Airing This Season" to="/seasonal" items={airing} />
        <Rail title="Most Popular" to="/browse/anime" items={popular} />
        <Rail title="Top Rated of All Time" to="/browse/anime" items={topRated} />
        <Rail title="Top Upcoming" to="/seasonal" items={upcoming} />
        <Rail title="Just Added" to="/search" items={justAdded} />
      </div>
    </div>
  )
}

function Rail({ title, to, items }) {
  if (!items || items.length === 0) return null
  return (
    <section className="mb-8">
      <SectionHeader title={title} to={to} />
      <div className="rail -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {items.map((a) => (
          <div key={a.mal_id} className="w-32 shrink-0 sm:w-36">
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>
    </section>
  )
}
