'use client'

import {
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Pause,
  ArrowsClockwise,
  BookOpen
} from '@phosphor-icons/react'
import { MediaListEntry, Media } from './types'

interface StatusBadgeProps {
  status: MediaListEntry['status']
  media: Media
}

const getStatusConfig = (isAnime: boolean) => ({
  CURRENT: {
    label: isAnime ? 'Watching' : 'Reading',
    className: 'bg-green-500/90 text-white',
    icon: isAnime ? Eye : BookOpen
  },
  COMPLETED: {
    label: isAnime ? 'Watched' : 'Read',
    className: 'bg-blue-500/90 text-white',
    icon: CheckCircle
  },
  PLANNING: {
    label: 'Planning',
    className: 'bg-purple-500/90 text-white',
    icon: Clock
  },
  DROPPED: {
    label: 'Dropped',
    className: 'bg-red-500/90 text-white',
    icon: XCircle
  },
  PAUSED: {
    label: 'Paused',
    className: 'bg-yellow-500/90 text-white',
    icon: Pause
  },
  REPEATING: {
    label: isAnime ? 'Rewatching' : 'Rereading',
    className: 'bg-cyan-500/90 text-white',
    icon: ArrowsClockwise
  }
})

export function StatusBadge({ status, media }: StatusBadgeProps) {
  // Determine if it's anime (has episodes) or manga (has chapters)
  const isAnime = media.episodes !== null
  const statusConfig = getStatusConfig(isAnime)
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={`absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shadow-md ${config.className}`}
    >
      <Icon size={12} weight="bold" />
      {config.label}
    </span>
  )
}
