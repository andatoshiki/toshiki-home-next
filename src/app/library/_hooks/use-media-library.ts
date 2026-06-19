'use client'

import { useState, useEffect, useMemo } from 'react'
import type { MediaListEntry } from '../_components/media/types'
import type { MediaType } from '../_components/media/media-type-tabs'
import type { StatusFilter } from '../_components/media/status-tabs'
import { getLocalMediaList } from '../_components/media/local-data'
import { clampPage, ITEMS_PER_PAGE } from './use-library-query-state'

export function useMediaLibrary(
  activeType: MediaType,
  currentPage: number,
  activeStatus: StatusFilter
) {
  const [entries, setEntries] = useState<MediaListEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeType === 'GAMES' || activeType === 'BOOKS') return

    setLoading(true)
    setError(null)
    try {
      const data = getLocalMediaList(activeType)
      setEntries(data)
      setLoading(false)
      if (data.length === 0) {
        setError(
          `No local ${activeType.toLowerCase()} data found. Run 'npx tsx tools/sync-anilist.ts --${activeType.toLowerCase()}' to sync.`
        )
      }
    } catch {
      setError(`Failed to load local ${activeType.toLowerCase()} data`)
      setLoading(false)
    }
  }, [activeType])

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      ALL: entries.length,
      CURRENT: 0,
      COMPLETED: 0,
      PLANNING: 0,
      PAUSED: 0,
      DROPPED: 0,
      REPEATING: 0
    }
    entries.forEach(entry => {
      counts[entry.status]++
    })
    return counts
  }, [entries])

  const filteredEntries = useMemo(
    () =>
      activeStatus === 'ALL'
        ? entries
        : entries.filter(e => e.status === activeStatus),
    [entries, activeStatus]
  )

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE)
  const page = clampPage(currentPage, totalPages)

  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredEntries, page])

  return {
    entries,
    loading,
    error,
    statusCounts,
    filteredEntries,
    paginatedEntries,
    totalPages,
    currentPage: page
  }
}
