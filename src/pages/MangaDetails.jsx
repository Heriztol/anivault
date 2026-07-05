import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMangaFull } from '../api/jikan.js'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

export default function MangaDetails() {
  const { id } = useParams()
  const [manga, setManga] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await getMangaFull(id)
      setManga(res.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) return <LoadingSpinner label="Loading manga" />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!manga) return null

  return (
    <div>
      <TopBar title={manga.title} showBack />
      <div className="px-4 py-6 lg:px-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <img src={manga.images?.jpg?.large_image_url} alt={manga.title} className="w-40 shrink-0 self-center rounded-xl shadow-card sm:self-start" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{manga.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {manga.score && (
                <span className="flex items-center gap-1 rounded-md bg-elevated px-2 py-1 text-sm font-semibold">
                  <span className="text-star">★</span> {manga.score}
                </span>
              )}
              {manga.genres?.slice(0, 4).map((g) => (
                <span key={g.mal_id} className="rounded-full bg-elevated2 px-2.5 py-1 text-xs text-white/70">{g.name}</span>
              ))}
            </div>
            <dl className="mt-4 grid max-w-md grid-cols-2 gap-y-1.5 text-sm">
              <dt className="text-white/40">Type</dt><dd className="text-white/80">{manga.type}</dd>
              <dt className="text-white/40">Chapters</dt><dd className="text-white/80">{manga.chapters || 'Ongoing'}</dd>
              <dt className="text-white/40">Volumes</dt><dd className="text-white/80">{manga.volumes || '—'}</dd>
              <dt className="text-white/40">Status</dt><dd className="text-white/80">{manga.status}</dd>
              <dt className="text-white/40">Published</dt><dd className="text-white/80">{manga.published?.string}</dd>
            </dl>
          </div>
        </div>
        <h3 className="mb-2 mt-6 font-semibold text-white/90">Synopsis</h3>
        <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-white/60">{manga.synopsis || 'No synopsis available.'}</p>
      </div>
    </div>
  )
}
