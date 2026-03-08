'use client'

import { ListBullets, GameController, Prohibit } from '@phosphor-icons/react'
import { GameFilterOption } from './types'

interface GameFilterTabsProps {
  activeFilter: GameFilterOption
  onFilterChange: (filter: GameFilterOption) => void
  counts: {
    all: number
    played: number
    unplayed: number
  }
}

const filterOptions: {
  value: GameFilterOption
  label: string
  icon: React.ReactNode
}[] = [
  {
    value: 'all',
    label: 'All',
    icon: <ListBullets className="h-4 w-4" weight="fill" />
  },
  {
    value: 'played',
    label: 'Played',
    icon: <GameController className="h-4 w-4" weight="fill" />
  },
  {
    value: 'unplayed',
    label: 'Unplayed',
    icon: <Prohibit className="h-4 w-4" weight="fill" />
  }
]

export function GameFilterTabs({
  activeFilter,
  onFilterChange,
  counts
}: GameFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map(option => {
        const count = counts[option.value]
        return (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === option.value
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeFilter === option.value
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
