'use client'

import {
  SortAscending,
  Clock,
  TextAa,
  Star,
  CalendarBlank
} from '@phosphor-icons/react'
import { GameSortOption } from './types'

interface GameSortTabsProps {
  activeSort: GameSortOption
  onSortChange: (sort: GameSortOption) => void
}

const sortOptions: {
  value: GameSortOption
  label: string
  icon: React.ReactNode
}[] = [
  {
    value: 'playtime',
    label: 'Playtime',
    icon: <Clock className="h-4 w-4" weight="fill" />
  },
  {
    value: 'recent',
    label: 'Recent',
    icon: <CalendarBlank className="h-4 w-4" weight="fill" />
  },
  {
    value: 'name',
    label: 'Name',
    icon: <TextAa className="h-4 w-4" weight="fill" />
  },
  {
    value: 'metacritic',
    label: 'Score',
    icon: <Star className="h-4 w-4" weight="fill" />
  }
]

export function GameSortTabs({ activeSort, onSortChange }: GameSortTabsProps) {
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
