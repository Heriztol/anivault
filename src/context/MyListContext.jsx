import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'anivault:mylist:v1'
const MyListContext = createContext(null)

const STATUSES = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch']

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function MyListProvider({ children }) {
  const [list, setList] = useState(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
      // storage unavailable (private mode, quota) - fail silently
    }
  }, [list])

  const upsert = useCallback((anime, status = 'plan_to_watch') => {
    setList((prev) => ({
      ...prev,
      [anime.mal_id]: {
        mal_id: anime.mal_id,
        title: anime.title,
        image: anime.images?.jpg?.image_url,
        episodes: anime.episodes,
        status,
        progress: prev[anime.mal_id]?.progress ?? 0,
        addedAt: prev[anime.mal_id]?.addedAt ?? Date.now(),
      },
    }))
  }, [])

  const remove = useCallback((malId) => {
    setList((prev) => {
      const next = { ...prev }
      delete next[malId]
      return next
    })
  }, [])

  const setProgress = useCallback((malId, progress) => {
    setList((prev) =>
      prev[malId] ? { ...prev, [malId]: { ...prev[malId], progress } } : prev
    )
  }, [])

  const getEntry = useCallback((malId) => list[malId], [list])

  const value = {
    list,
    entries: Object.values(list),
    upsert,
    remove,
    setProgress,
    getEntry,
    STATUSES,
  }

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
}

export function useMyList() {
  const ctx = useContext(MyListContext)
  if (!ctx) throw new Error('useMyList must be used within MyListProvider')
  return ctx
}
