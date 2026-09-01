import { Desktop, Globe, Keyboard } from '@phosphor-icons/react'
import type { ElementType } from 'react'
import type { UsesEntry } from '#content'

export type UsesType = UsesEntry['type']

interface UsesTypeTabsProps {
  activeType: UsesType
  onTypeChange: (type: UsesType) => void
}

const tabs: {
  type: UsesType
  label: string
  icon: ElementType
}[] = [
  { type: 'software', label: 'Software', icon: Desktop },
  { type: 'hardware', label: 'Hardware', icon: Desktop },
  { type: 'peripherals', label: 'Peripherals', icon: Keyboard },
  { type: 'browser', label: 'Browsers', icon: Globe }
]

export function UsesTypeTabs({ activeType, onTypeChange }: UsesTypeTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeType === tab.type

        return (
          <button
            key={tab.type}
            type="button"
            aria-pressed={isActive}
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
