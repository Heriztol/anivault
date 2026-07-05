import { useNavigate } from 'react-router-dom'
import { getRandomAnime } from '../api/jikan.js'
import TopBar from '../components/TopBar.jsx'

const ITEMS = [
  { label: 'Random Anime', sub: 'Discover something new', icon: '🔀', action: 'random' },
  { label: 'Rankings', sub: 'Browse top charts', icon: '🏆', to: '/rankings' },
  { label: 'Browse by Genre', sub: 'Find anime by genre', icon: '🏷️', to: '/browse/anime' },
  { label: 'Manga', sub: 'Browse manga titles', icon: '📖', to: '/manga' },
  { label: 'Characters', sub: 'Explore favorite characters', icon: '🎭', to: '/characters' },
  { label: 'News', sub: "See what's happening", icon: '📰', to: '/news' },
  { label: 'Reviews', sub: 'Read community reviews', icon: '📝', to: '/reviews' },
  { label: 'Community', sub: 'Discussions & threads', icon: '💬', to: '/community' },
  { label: 'Settings', sub: 'App preferences', icon: '⚙️', to: '/settings' },
]

export default function More() {
  const navigate = useNavigate()

  async function handleClick(item) {
    if (item.action === 'random') {
      try {
        const r = await getRandomAnime()
        if (r.data?.mal_id) navigate(`/anime/${r.data.mal_id}`)
      } catch {
        // ignore — Jikan's random endpoint occasionally hiccups, user can just tap again
      }
      return
    }
    navigate(item.to)
  }

  return (
    <div>
      <TopBar title="More" showBack />
      <div className="flex flex-col divide-y divide-border px-4 lg:px-6">
        {ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
            className="flex items-center gap-3 py-4 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-lg">{item.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-xs text-white/40">{item.sub}</span>
            </span>
            <span className="text-white/30">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
