import { Link } from 'react-router-dom'

export default function AnimeCard({ anime, subtitle, className = '' }) {
  if (!anime) return null
  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
  const score = anime.score
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className={`group relative block w-full overflow-hidden rounded-xl bg-elevated shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-glow ${className}`}
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={anime.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-elevated2 text-xs text-white/40">
            No image
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        {score ? (
          <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
            <span className="text-star">★</span>
            <span>{score}</span>
          </div>
        ) : null}
      </div>
      <div className="p-2">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-white/90">{anime.title}</p>
        {subtitle ? <p className="mt-0.5 text-xs text-white/50">{subtitle}</p> : null}
      </div>
    </Link>
  )
}
