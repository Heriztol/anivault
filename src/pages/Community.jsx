import TopBar from '../components/TopBar.jsx'

export default function Community() {
  return (
    <div>
      <TopBar title="Community" />
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-elevated text-2xl">💬</div>
        <h1 className="font-display text-xl font-bold">Community is coming</h1>
        <p className="max-w-sm text-sm text-white/50">
          Episode discussions, comments, and replies need real accounts and moderation tools to work
          properly — that's Phase 3 on AniVault's roadmap, built on top of the Supabase accounts
          from Phase 2. For now, enjoy the browsing side of the app.
        </p>
      </div>
    </div>
  )
}
