import { useMyList } from '../context/MyListContext.jsx'
import TopBar from '../components/TopBar.jsx'

export default function Settings() {
  const { entries } = useMyList()

  function clearList() {
    if (confirm(`Remove all ${entries.length} title(s) from your local My List? This can't be undone.`)) {
      localStorage.removeItem('anivault:mylist:v1')
      window.location.reload()
    }
  }

  return (
    <div>
      <TopBar title="Settings" />
      <div className="max-w-xl px-4 py-6 lg:px-6">
        <section className="mb-6 rounded-xl bg-elevated p-4">
          <h2 className="mb-1 text-sm font-semibold">Data</h2>
          <p className="mb-3 text-sm text-white/50">
            Your My List ({entries.length} title{entries.length === 1 ? '' : 's'}) is stored only in
            this browser. Clearing it can't be undone, and it won't sync anywhere else until
            accounts land in Phase 2.
          </p>
          <button
            onClick={clearList}
            className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20"
          >
            Clear My List
          </button>
        </section>

        <section className="rounded-xl bg-elevated p-4">
          <h2 className="mb-1 text-sm font-semibold">About AniVault</h2>
          <p className="text-sm text-white/50">
            Phase 1 — a frontend-only browser powered by the Jikan API (an unofficial MyAnimeList
            mirror). No account system yet, so there's nothing else to configure here.
          </p>
        </section>
      </div>
    </div>
  )
}
