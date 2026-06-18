'use client'

import { startTransition, useEffect, useState } from 'react'
import {
  fetchLeetcodeCalendar,
  padToFullYear,
  type LeetcodeCalendarDay,
  type LeetcodeStats
} from '~/lib/api/leetcode/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeetcodeCalendarResult = {
  days: LeetcodeCalendarDay[]
} & LeetcodeStats

type QueryState<T> = {
  data: T | null
  error: string | null
  isLoading: boolean
}

// ─── Cache ────────────────────────────────────────────────────────────────────

type CacheEntry = { data: unknown; timestamp: number }
const cache = new Map<string, CacheEntry>()
const TTL_MS = 30 * 60 * 1000

function readCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry || Date.now() - entry.timestamp >= TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

function writeCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() })
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLeetcodeCalendar(
  username: string,
  year: number
): QueryState<LeetcodeCalendarResult> {
  const key = `lc:${username}:${year}`

  const [state, setState] = useState<QueryState<LeetcodeCalendarResult>>(() => {
    const cached = readCache<LeetcodeCalendarResult>(key)
    return { data: cached, error: null, isLoading: !cached }
  })

  useEffect(() => {
    const cached = readCache<LeetcodeCalendarResult>(key)
    if (cached) {
      setState({ data: cached, error: null, isLoading: false })
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    fetchLeetcodeCalendar(username, year)
      .then(({ days: raw, ...stats }) => {
        const days = padToFullYear(raw, year)
        const result: LeetcodeCalendarResult = { days, ...stats }
        writeCache(key, result)
        startTransition(() =>
          setState({ data: result, error: null, isLoading: false })
        )
      })
      .catch(err => {
        const message =
          err instanceof Error ? err.message : 'Failed to load LeetCode data'
        startTransition(() =>
          setState(prev => ({ ...prev, error: message, isLoading: false }))
        )
      })
  }, [key, username, year])

  return state
}
