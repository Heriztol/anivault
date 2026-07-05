# AniVault — Phase 1

A Jikan-powered anime browser: Home, Search, Anime Details (Overview / Episodes / Characters / Reviews), Seasonal, Genre & Studio browse, and a local "My List" (saved to your browser via localStorage — no account yet, that's Phase 2 with Supabase).

Stack: **Vite + React + React Router + Tailwind CSS**. No backend, no build step beyond `vite build`. Deploys straight to Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. Mobile view: shrink the browser window or open dev tools' device toolbar — the layout switches to bottom-tab nav under the `lg` breakpoint (1024px).

## Project structure

```
src/
  api/jikan.js          # All Jikan API calls, with request queueing + caching (rate-limit safe)
  context/MyListContext.jsx   # localStorage-backed watchlist state
  components/           # Sidebar, BottomNav, TopBar, AnimeCard, etc.
  pages/                # Home, Search, AnimeDetails, Seasonal, Browse, MyList, NotFound
  App.jsx               # Routes
```

## Notes on the Jikan API

- Public rate limit is roughly 3 req/sec and 60/min. `src/api/jikan.js` serializes every request through a small queue with a ~400ms gap, and retries once on a 429. If you see anything feel slow, that's this safety margin working as intended — you can tighten `MIN_GAP_MS` later if you self-host a proxy.
- Studio browsing filters client-side from a popularity-sorted page since Jikan's public `/anime` search doesn't expose a producer/studio filter param on every deployment — good enough for Phase 1, worth revisiting if you add a backend proxy in Phase 2.

## Phase roadmap (for your own notes)

- **Phase 1 (this repo):** frontend-only Jikan browser. Done.
- **Phase 2:** swap `MyListContext`'s localStorage for Supabase (Auth + Postgres + RLS) so lists sync across devices; add real user profiles/stats.
- **Phase 3:** discussion threads, moderation, admin dashboard — stretch goal, bigger scope.

---

See the deployment walkthrough in chat for the VS Code → GitHub → Vercel steps.
