import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getAnimeFull,
  getAnimeEpisodes,
  getAnimeCharacters,
  getAnimeReviews,
} from '../api/jikan.js'
import { useMyList } from '../context/MyListContext.jsx'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

const TABS = ['Overview', 'Episodes', 'Characters', 'Reviews']

export default function AnimeDetails() {
  const { id } = useParams()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('Overview')
  const { getEntry, upsert, setProgress, STATUSES } = useMyList()

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await getAnimeFull(id)
      setAnime(res.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    setTab('Overview')
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) return <LoadingSpinner label="Loading anime" />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!anime) return null

  const entry = getEntry(Number(id))

  return (
    <div>
      <TopBar title={anime.title} showBack />

      <div className="relative hidden h-40 overflow-hidden lg:block">
        <img src={anime.images?.jpg?.large_image_url} alt="" className="h-full w-full object-cover opacity-25 blur-md" />
        <div className="absolute inset-0 bg-base/60" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-base" />
      </div>

      <div className="px-4 pb-8 lg:px-6 lg:pt-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <img
            src={anime.images?.jpg?.large_image_url}
            alt={anime.title}
            className="w-40 shrink-0 self-center rounded-xl shadow-card sm:self-start"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{anime.title}</h1>
            {anime.title_japanese && <p className="text-sm text-white/40">{anime.title_japanese}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {anime.score && (
                <span className="flex items-center gap-1 rounded-md bg-elevated px-2 py-1 text-sm font-semibold">
                  <span className="text-star">★</span> {anime.score}
                </span>
              )}
              {anime.rank && <span className="rounded-md bg-elevated px-2 py-1 text-sm text-white/60">Rank #{anime.rank}</span>}
              {anime.genres?.slice(0, 3).map((g) => (
                <span key={g.mal_id} className="rounded-full bg-elevated2 px-2.5 py-1 text-xs text-white/70">
                  {g.name}
                </span>
              ))}
            </div>

            <dl className="mt-4 grid max-w-md grid-cols-2 gap-y-1.5 text-sm">
              <Info label="Type" value={anime.type} />
              <Info label="Episodes" value={anime.episodes} />
              <Info label="Status" value={anime.status} />
              <Info label="Aired" value={anime.aired?.string} />
              <Info label="Studio" value={anime.studios?.map((s) => s.name).join(', ')} />
              <Info label="Duration" value={anime.duration} />
              <Info label="Source" value={anime.source} />
              <Info label="Rating" value={anime.rating} />
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              {anime.trailer?.url && (
                <a
                  href={anime.trailer.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-accent-gradient px-4 py-2 text-sm font-semibold shadow-glow"
                >
                  ▶ Watch Trailer
                </a>
              )}
              <select
                value={entry?.status || ''}
                onChange={(e) => upsert(anime, e.target.value || 'plan_to_watch')}
                className="rounded-full border border-border bg-elevated px-4 py-2 text-sm focus:outline-none"
              >
                <option value="" disabled>{entry ? 'In list' : '+ Add to List'}</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{labelFor(s)}</option>
                ))}
              </select>
              {entry && (
                <span className="flex items-center rounded-full bg-elevated px-3 py-2 text-xs text-white/50">
                  Progress: {entry.progress}/{anime.episodes || '?'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t ? 'border-accent text-white' : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="pt-5">
          {tab === 'Overview' && <Overview anime={anime} />}
          {tab === 'Episodes' && <Episodes id={id} entry={entry} anime={anime} setProgress={setProgress} />}
          {tab === 'Characters' && <Characters id={id} />}
          {tab === 'Reviews' && <Reviews id={id} />}
        </div>
      </div>
    </div>
  )
}

function labelFor(s) {
  return { watching: 'Watching', completed: 'Completed', on_hold: 'On Hold', dropped: 'Dropped', plan_to_watch: 'Plan to Watch' }[s]
}

function Info({ label, value }) {
  if (!value) return null
  return (
    <>
      <dt className="text-white/40">{label}</dt>
      <dd className="text-white/80">{value}</dd>
    </>
  )
}

function Overview({ anime }) {
  return (
    <div>
      <h3 className="mb-2 font-semibold text-white/90">Synopsis</h3>
      <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-white/60">
        {anime.synopsis || 'No synopsis available.'}
      </p>
      {anime.background && (
        <>
          <h3 className="mb-2 mt-6 font-semibold text-white/90">Background</h3>
          <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-white/60">{anime.background}</p>
        </>
      )}
    </div>
  )
}

function Episodes({ id, entry, setProgress }) {
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getAnimeEpisodes(id)
      .then((r) => setEpisodes(r.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner label="Loading episodes" />
  if (error) return <ErrorState message={error} />
  if (episodes.length === 0) return <p className="text-white/40">No episode data available from Jikan for this title.</p>

  return (
    <div className="flex max-w-2xl flex-col gap-2">
      {episodes.map((ep) => {
        const watched = entry && ep.mal_id <= entry.progress
        return (
          <div
            key={ep.mal_id}
            className="flex items-center justify-between gap-3 rounded-lg bg-elevated px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">
                Episode {ep.mal_id} {ep.title ? `· ${ep.title}` : ''}
              </p>
              <p className="text-xs text-white/40">{ep.aired ? new Date(ep.aired).toLocaleDateString() : ''}{ep.score ? ` · ★ ${ep.score}` : ''}</p>
            </div>
            {entry && (
              <button
                onClick={() => setProgress(entry.mal_id, watched ? ep.mal_id - 1 : ep.mal_id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  watched ? 'bg-accent-gradient' : 'bg-elevated2 text-white/50 hover:bg-white/10'
                }`}
              >
                {watched ? 'Watched' : 'Mark'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Characters({ id }) {
  const [chars, setChars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getAnimeCharacters(id)
      .then((r) => setChars((r.data || []).slice(0, 18)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner label="Loading characters" />
  if (error) return <ErrorState message={error} />

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {chars.map((c) => (
        <div key={c.character.mal_id} className="text-center">
          <img
            src={c.character.images?.jpg?.image_url}
            alt={c.character.name}
            className="mx-auto aspect-square w-full rounded-lg object-cover"
          />
          <p className="mt-1.5 line-clamp-2 text-xs font-medium text-white/80">{c.character.name}</p>
          <p className="text-[11px] text-white/40">{c.role}</p>
        </div>
      ))}
    </div>
  )
}

function Reviews({ id }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getAnimeReviews(id)
      .then((r) => setReviews((r.data || []).slice(0, 8)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner label="Loading reviews" />
  if (error) return <ErrorState message={error} />
  if (reviews.length === 0) return <p className="text-white/40">No reviews yet.</p>

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {reviews.map((rv) => (
        <div key={rv.mal_id} className="rounded-lg bg-elevated p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-semibold">{rv.user?.username}</p>
            <span className="text-xs text-star">★ {rv.score}</span>
          </div>
          <p className="line-clamp-3 text-sm text-white/60">{rv.review}</p>
        </div>
      ))}
    </div>
  )
}
