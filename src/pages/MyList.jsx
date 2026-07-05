import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyList } from '../context/MyListContext.jsx'
import TopBar from '../components/TopBar.jsx'

const TABS = [
  { key: 'watching', label: 'Watching' },
  { key: 'completed', label: 'Completed' },
  { key: 'on_hold', label: 'On Hold' },
  { key: 'dropped', label: 'Dropped' },
  { key: 'plan_to_watch', label: 'Plan to Watch' },
]

export default function MyList() {
  const { entries, remove } = useMyList()
  const [tab, setTab] = useState('watching')

  const filtered = entries
    .filter((e) => e.status === tab)
    .sort((a, b) => b.addedAt - a.addedAt)

  return (
    <div>
      <TopBar title="My List" />
      <div className="px-4 py-4 lg:px-6">
        <div className="flex gap-2 overflow-x-auto border-b border-border pb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
                tab === t.key ? 'bg-accent-gradient' : 'bg-elevated text-white/60 hover:bg-elevated2'
              }`}
            >
              {t.label} <span className="opacity-60">({entries.filter((e) => e.status === t.key).length})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-14 text-center text-white/40">
            Nothing here yet. Add titles from any anime page.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {filtered.map((e) => {
              const pct = e.episodes ? Math.min(100, Math.round((e.progress / e.episodes) * 100)) : 0
              return (
                <div key={e.mal_id} className="flex items-center gap-3 rounded-xl bg-elevated p-3">
                  <Link to={`/anime/${e.mal_id}`} className="shrink-0">
                    <img src={e.image} alt={e.title} className="h-20 w-14 rounded-lg object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/anime/${e.mal_id}`} className="line-clamp-1 text-sm font-semibold hover:text-accent">
                      {e.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-white/40">
                      {e.progress} / {e.episodes || '?'}
                    </p>
                    <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-elevated2">
                      <div className="h-full bg-accent-gradient" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => remove(e.mal_id)}
                    className="shrink-0 rounded-full bg-elevated2 px-2.5 py-1 text-xs text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
