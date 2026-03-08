'use client'

import {
  SortAscending,
  Clock,
  Star,
  CalendarBlank
} from '@phosphor-icons/react'
import { BookSortOption } from './types'

interface BookSortTabsProps {
  activeSort: BookSortOption
  onSortChange: (sort: BookSortOption) => void
}

const sortOptions: {
  value: BookSortOption
  label: string
  icon: React.ReactNode
}[] = [
  {
    value: 'recent',
    label: 'Recent',
    icon: <Clock className="h-4 w-4" weight="fill" />
  },
  {
    value: 'dateAdded',
    label: 'Added',
    icon: <CalendarBlank className="h-4 w-4" weight="fill" />
  },
  {
    value: 'rating',
    label: 'My Rating',
    icon: <Star className="h-4 w-4" weight="fill" />
  }
]

export function BookSortTabs({ activeSort, onSortChange }: BookSortTabsProps) {
  return (
    <div className="flex items-center gap-2">
      <SortAscending className="h-4 w-4 text-neutral-400" />
      <div className="flex flex-wrap gap-2">
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              activeSort === option.value
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
