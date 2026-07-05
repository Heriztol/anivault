const BASE_URL = 'https://api.jikan.moe/v4'

// --- Simple request queue -------------------------------------------------
// Jikan's public rate limit is ~3 requests/second and 60/minute.
// We serialize requests and space them out so bursts (e.g. Promise.all on a
// details page) don't get 429'd.
let queue = Promise.resolve()
const MIN_GAP_MS = 400

function schedule(task) {
  const run = () => new Promise((resolve) => setTimeout(() => resolve(task()), MIN_GAP_MS))
  queue = queue.then(run, run)
  return queue
}

// --- Tiny in-memory cache (per session) ----------------------------------
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function request(path, { useCache = true } = {}) {
  const key = path
  const cached = cache.get(key)
  if (useCache && cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }

  const doFetch = async (retriesLeft = 3) => {
    const res = await fetch(`${BASE_URL}${path}`)
    if (res.status === 429 && retriesLeft > 0) {
      await new Promise((r) => setTimeout(r, 1200))
      return doFetch(retriesLeft - 1)
    }
    if (!res.ok) {
      throw new Error(`Jikan request failed (${res.status}) for ${path}`)
    }
    return res.json()
  }

  const data = await schedule(() => doFetch())
  cache.set(key, { data, time: Date.now() })
  return data
}

// --- Public API ------------------------------------------------------------

export function getTopAnime({ page = 1, filter = '' } = {}) {
  const q = filter ? `&filter=${filter}` : ''
  return request(`/top/anime?page=${page}${q}`)
}

export function getSeasonNow({ page = 1 } = {}) {
  return request(`/seasons/now?page=${page}&sfw`)
}

export function getSeasonUpcoming({ page = 1 } = {}) {
  return request(`/seasons/upcoming?page=${page}&sfw`)
}

export function getSeason(year, season, { page = 1 } = {}) {
  return request(`/seasons/${year}/${season}?page=${page}&sfw`)
}

export function getSeasonsList() {
  return request('/seasons')
}

export function getScheduleByDay(day) {
  return request(`/schedules/${day}?sfw`)
}

export function searchAnime({ q = '', page = 1, genres = '', type = '', status = '', order_by = '', sort = 'desc' } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  params.set('page', page)
  if (genres) params.set('genres', genres)
  if (type) params.set('type', type)
  if (status) params.set('status', status)
  if (order_by) {
    params.set('order_by', order_by)
    params.set('sort', sort)
  }
  params.set('sfw', 'true')
  return request(`/anime?${params.toString()}`, { useCache: !q })
}

export function getAnimeFull(id) {
  return request(`/anime/${id}/full`)
}

export function getAnimeEpisodes(id, page = 1) {
  return request(`/anime/${id}/episodes?page=${page}`)
}

export function getAnimeCharacters(id) {
  return request(`/anime/${id}/characters`)
}

export function getAnimeRecommendations(id) {
  return request(`/anime/${id}/recommendations`)
}

export function getAnimeReviews(id, page = 1) {
  return request(`/anime/${id}/reviews?page=${page}`)
}

export function getCharacterFull(id) {
  return request(`/characters/${id}/full`)
}

export function getTopCharacters({ page = 1 } = {}) {
  return request(`/top/characters?page=${page}`)
}

export function getAnimeNews(id) {
  return request(`/anime/${id}/news`)
}

export function getGenres() {
  return request('/genres/anime')
}

export function getMangaGenres() {
  return request('/genres/manga')
}

export function getStudios({ page = 1 } = {}) {
  return request(`/producers?page=${page}`)
}

export function getRandomAnime() {
  return request('/random/anime', { useCache: false })
}

export function getRandomCharacter() {
  return request('/random/characters', { useCache: false })
}

// --- Manga -------------------------------------------------------------

export function getTopManga({ page = 1, filter = '' } = {}) {
  const q = filter ? `&filter=${filter}` : ''
  return request(`/top/manga?page=${page}${q}`)
}

export function searchManga({ q = '', page = 1, genres = '', type = '', order_by = '', sort = 'desc' } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  params.set('page', page)
  if (genres) params.set('genres', genres)
  if (type) params.set('type', type)
  if (order_by) {
    params.set('order_by', order_by)
    params.set('sort', sort)
  }
  params.set('sfw', 'true')
  return request(`/manga?${params.toString()}`, { useCache: !q })
}

export function getMangaFull(id) {
  return request(`/manga/${id}/full`)
}
