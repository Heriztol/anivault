import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-center">
      <p className="font-display text-4xl font-bold">404</p>
      <p className="text-white/50">This page wandered off into another dimension.</p>
      <Link to="/" className="mt-2 rounded-full bg-accent-gradient px-5 py-2 text-sm font-semibold">
        Back to Home
      </Link>
    </div>
  )
}
