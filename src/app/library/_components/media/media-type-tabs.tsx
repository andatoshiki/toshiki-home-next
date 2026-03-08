'use client'

import { Television, Book, GameController, Books } from '@phosphor-icons/react'

export type MediaType = 'ANIME' | 'MANGA' | 'GAMES' | 'BOOKS'

interface MediaTypeTabsProps {
  activeType: MediaType
  onTypeChange: (type: MediaType) => void
}

const tabs: {
  type: MediaType
  label: string
  icon: React.ElementType
}[] = [
  { type: 'ANIME', label: 'Anime', icon: Television },
  { type: 'MANGA', label: 'Manga', icon: Book },
  { type: 'GAMES', label: 'Games', icon: GameController },
  { type: 'BOOKS', label: 'Books', icon: Books }
]

export function MediaTypeTabs({
  activeType,
  onTypeChange
}: MediaTypeTabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeType === tab.type

        return (
          <button
            key={tab.type}
            onClick={() => onTypeChange(tab.type)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
