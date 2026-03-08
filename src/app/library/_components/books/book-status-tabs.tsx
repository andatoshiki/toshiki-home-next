'use client'

import {
  ListBullets,
  BookOpen,
  BookBookmark,
  Heart,
  XCircle,
  Books
} from '@phosphor-icons/react'
import { BookStatusFilter } from './types'

interface BookStatusTabsProps {
  activeStatus: BookStatusFilter
  onStatusChange: (status: BookStatusFilter) => void
  counts: {
    all: number
    wantToRead: number
    currentlyReading: number
    read: number
    didNotFinish: number
    owned: number
  }
}

const statusOptions: {
  value: BookStatusFilter
  label: string
  icon: React.ReactNode
  countKey: keyof BookStatusTabsProps['counts']
}[] = [
  {
    value: 'ALL',
    label: 'All',
    icon: <ListBullets className="h-4 w-4" weight="fill" />,
    countKey: 'all'
  },
  {
    value: 'CURRENTLY_READING',
    label: 'Reading',
    icon: <BookOpen className="h-4 w-4" weight="fill" />,
    countKey: 'currentlyReading'
  },
  {
    value: 'WANT_TO_READ',
    label: 'Want to Read',
    icon: <BookBookmark className="h-4 w-4" weight="fill" />,
    countKey: 'wantToRead'
  },
  {
    value: 'READ',
    label: 'Read',
    icon: <Heart className="h-4 w-4" weight="fill" />,
    countKey: 'read'
  },
  {
    value: 'DID_NOT_FINISH',
    label: 'DNF',
    icon: <XCircle className="h-4 w-4" weight="fill" />,
    countKey: 'didNotFinish'
  },
  {
    value: 'OWNED',
    label: 'Owned',
    icon: <Books className="h-4 w-4" weight="fill" />,
    countKey: 'owned'
  }
]

export function BookStatusTabs({
  activeStatus,
  onStatusChange,
  counts
}: BookStatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map(option => {
        const count = counts[option.countKey]
        // Don't show tabs with 0 count (except ALL)
        if (count === 0 && option.value !== 'ALL') return null

        return (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeStatus === option.value
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeStatus === option.value
                  ? 'bg-white/20 text-white dark:bg-neutral-900/30 dark:text-neutral-900'
                  : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
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
