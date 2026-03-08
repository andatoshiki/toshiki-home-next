'use client'

import { useEffect, useState } from 'react'
import {
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Pause,
  ArrowsClockwise,
  ListBullets,
  BookOpen
} from '@phosphor-icons/react'
import { MediaListEntry } from './types'
import { MediaType } from './media-type-tabs'

export type StatusFilter = MediaListEntry['status'] | 'ALL'

interface StatusTabsProps {
  activeStatus: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  counts: Record<StatusFilter, number>
  mediaType?: MediaType
}

const getTabConfig = (mediaType: MediaType = 'ANIME') => {
  const isAnime = mediaType === 'ANIME'
  return [
    { status: 'ALL' as StatusFilter, label: 'All', icon: ListBullets },
    {
      status: 'CURRENT' as StatusFilter,
      label: isAnime ? 'Watching' : 'Reading',
      icon: isAnime ? Eye : BookOpen
    },
    {
      status: 'COMPLETED' as StatusFilter,
      label: isAnime ? 'Watched' : 'Read',
      icon: CheckCircle
    },
    { status: 'PLANNING' as StatusFilter, label: 'Planning', icon: Clock },
    { status: 'PAUSED' as StatusFilter, label: 'Paused', icon: Pause },
    { status: 'DROPPED' as StatusFilter, label: 'Dropped', icon: XCircle },
    {
      status: 'REPEATING' as StatusFilter,
      label: isAnime ? 'Rewatching' : 'Rereading',
      icon: ArrowsClockwise
    }
  ]
}

export function StatusTabs({
  activeStatus,
  onStatusChange,
  counts,
  mediaType = 'ANIME'
}: StatusTabsProps) {
  const tabs = getTabConfig(mediaType)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeStatus === tab.status
        const count = counts[tab.status]

        let iconColor = '#000000'
        if (isActive) {
          iconColor = isDark ? '#000000' : '#ffffff'
        } else {
          iconColor = isDark ? '#ffffff' : '#000000'
        }

        // Don't show tabs with 0 count (except ALL)
        if (tab.status !== 'ALL' && count === 0) return null

        return (
          <button
            key={tab.status}
            onClick={() => onStatusChange(tab.status)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            <Icon
              size={14}
              weight={isActive ? 'fill' : 'regular'}
              style={{ color: iconColor }}
            />
            <span>{tab.label}</span>
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs ${
                isActive
                  ? 'bg-white/20 dark:bg-black/20'
                  : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
