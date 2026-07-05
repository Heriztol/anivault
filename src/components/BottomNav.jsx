import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/search', label: 'Explore', icon: '🔍' },
  { to: '/mylist', label: 'My List', icon: '📋' },
  { to: '/seasonal', label: 'Seasonal', icon: '🗓️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur lg:hidden">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              isActive ? 'text-accent' : 'text-white/50'
            }`
          }
        >
          <span className="text-lg leading-none" aria-hidden>{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
