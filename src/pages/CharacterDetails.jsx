import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCharacterFull } from '../api/jikan.js'
import TopBar from '../components/TopBar.jsx'
import LoadingSpinner, { ErrorState } from '../components/LoadingSpinner.jsx'

export default function CharacterDetails() {
  const { id } = useParams()
  const [char, setChar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await getCharacterFull(id)
      setChar(res.data)
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

  if (loading) return <LoadingSpinner label="Loading character" />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!char) return null

  return (
    <div>
      <TopBar title={char.name} showBack />
      <div className="px-4 py-6 lg:px-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <img src={char.images?.jpg?.image_url} alt={char.name} className="w-40 shrink-0 self-center rounded-xl shadow-card sm:self-start" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{char.name}</h1>
            {char.name_kanji && <p className="text-sm text-white/40">{char.name_kanji}</p>}
            <p className="mt-2 text-sm text-white/50">❤ {char.favorites?.toLocaleString()} favorites</p>

            {char.anime?.length > 0 && (
              <>
                <h3 className="mb-2 mt-5 font-semibold text-white/90">Appears In</h3>
                <div className="flex flex-wrap gap-2">
                  {char.anime.slice(0, 8).map((a) => (
                    <Link
                      key={a.anime.mal_id}
                      to={`/anime/${a.anime.mal_id}`}
                      className="rounded-full bg-elevated px-3 py-1.5 text-xs font-medium hover:bg-elevated2"
                    >
                      {a.anime.title} · {a.role}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {char.about && (
          <>
            <h3 className="mb-2 mt-6 font-semibold text-white/90">About</h3>
            <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-white/60">{char.about}</p>
          </>
        )}
      </div>
    </div>
  )
}
