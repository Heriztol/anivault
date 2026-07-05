import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/browse/anime', label: 'Anime', icon: '📺' },
  { to: '/manga', label: 'Manga', icon: '📖' },
  { to: '/rankings', label: 'Rankings', icon: '🏆' },
  { to: '/news', label: 'News', icon: '📰' },
  { to: '/community', label: 'Community', icon: '💬' },
  { to: '/characters', label: 'Characters', icon: '🎭' },
  { to: '/browse/anime', label: 'Studios', icon: '🎬' },
  { to: '/seasonal', label: 'Seasonal', icon: '🗓️' },
  { to: '/mylist', label: 'My List', icon: '📋' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient text-sm font-bold">
          AV
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">AniVault</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-gradient text-white shadow-glow'
                  : 'text-white/60 hover:bg-elevated hover:text-white'
              }`
            }
          >
            <span aria-hidden>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium ${
            isActive ? 'bg-elevated text-white' : 'text-white/60 hover:bg-elevated hover:text-white'
          }`
        }
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gradient text-xs font-bold">
          SA
        </span>
        <span className="min-w-0">
          <span className="block truncate">ShadowAce</span>
          <span className="block text-xs text-white/40">View profile</span>
        </span>
      </NavLink>
    </aside>
  )
}
