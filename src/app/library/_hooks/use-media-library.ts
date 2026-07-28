'use client'

import { useMemo } from 'react'
import type { MediaType } from '../_components/media/media-type-tabs'
import type { StatusFilter } from '../_components/media/status-tabs'
import { getLocalMediaList } from '../_components/media/local-data'
import { clampPage, ITEMS_PER_PAGE } from './use-library-query-state'

export function useMediaLibrary(
  activeType: MediaType,
  currentPage: number,
  activeStatus: StatusFilter
) {
  const entries = useMemo(
    () =>
      activeType === 'ANIME' || activeType === 'MANGA'
        ? getLocalMediaList(activeType)
        : [],
    [activeType]
  )

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
    statusCounts,
    filteredEntries,
    paginatedEntries,
    totalPages,
    currentPage: page
  }
}
