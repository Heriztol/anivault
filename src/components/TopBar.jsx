import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, showBack = false }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-base/80 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="rounded-full p-1 text-lg text-white/70">
            ←
          </button>
        ) : null}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <button onClick={() => navigate('/search')} className="rounded-full p-2 text-lg text-white/70 hover:bg-elevated">
        🔍
      </button>
    </header>
  )
}
