export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
      <p className="text-sm">{label}…</p>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-white/60">
      <p className="text-sm">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="rounded-full bg-elevated2 px-4 py-1.5 text-sm font-medium hover:bg-elevated"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
