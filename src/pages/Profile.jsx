import { useMyList } from '../context/MyListContext.jsx'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'

const BADGES = ['⭐', '🎖️', '📚', '🎬', '💎', '🏅']

export default function Profile() {
  const { entries } = useMyList()

  const completed = entries.filter((e) => e.status === 'completed').length
  const watching = entries.filter((e) => e.status === 'watching').length
  const planToWatch = entries.filter((e) => e.status === 'plan_to_watch').length
  const totalEpisodesWatched = entries.reduce((sum, e) => sum + (e.progress || 0), 0)

  return (
    <div>
      <TopBar title="Profile" />
      <div className="px-4 py-6 lg:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-hero-gradient p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.35),transparent_60%)]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gradient text-xl font-bold shadow-glow">
              SA
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">ShadowAce</h1>
              <p className="text-sm text-white/70">🏆 Level 82 · Preview profile</p>
            </div>
          </div>
        </div>

        <p className="mt-3 max-w-xl text-sm text-white/40">
          This is a local, on-device profile — stats below come from your My List. Accounts, real
          levels, achievements, and friends sync in once AniVault adds Supabase auth (Phase 2).
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Completed" value={completed} />
          <Stat label="Watching" value={watching} />
          <Stat label="Plan to Watch" value={planToWatch} />
          <Stat label="Episodes Watched" value={totalEpisodesWatched} />
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {BADGES.map((b, i) => (
              <div
                key={i}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-xl opacity-40"
                title="Unlocks with accounts in Phase 2"
              >
                {b}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-xl">
          <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
          {entries.length === 0 ? (
            <p className="text-sm text-white/40">
              Nothing tracked yet. <Link to="/search" className="text-accent">Find something to watch</Link>.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {entries
                .slice()
                .sort((a, b) => b.addedAt - a.addedAt)
                .slice(0, 6)
                .map((e) => (
                  <Link
                    key={e.mal_id}
                    to={`/anime/${e.mal_id}`}
                    className="flex items-center gap-3 rounded-lg bg-elevated px-3 py-2 hover:bg-elevated2"
                  >
                    <img src={e.image} alt="" className="h-10 w-8 rounded object-cover" />
                    <span className="min-w-0 flex-1 truncate text-sm">
                      Added <span className="font-medium">{e.title}</span> to {labelFor(e.status)}
                    </span>
                  </Link>
                ))}
            </div>
          )}
        </div>

        <Link
          to="/more"
          className="mt-8 flex items-center justify-between rounded-xl bg-elevated px-4 py-3 text-sm font-medium hover:bg-elevated2 lg:hidden"
        >
          More · Rankings, Manga, Characters, News, Settings
          <span className="text-white/30">›</span>
        </Link>
      </div>
    </div>
  )
}

function labelFor(s) {
  return { watching: 'Watching', completed: 'Completed', on_hold: 'On Hold', dropped: 'Dropped', plan_to_watch: 'Plan to Watch' }[s]
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-elevated p-4 text-center">
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs text-white/50">{label}</p>
    </div>
  )
}
