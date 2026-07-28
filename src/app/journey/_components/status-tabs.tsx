'use client'

import { MapPin, House, AirplaneTakeoff, Heart } from '@phosphor-icons/react'

import {
  JOURNEY_STATUS_DETAILS,
  type JourneyStatus,
  type JourneyStatusCounts,
  type JourneyStatusFilter
} from './journey-status'

interface StatusTabsProps {
  activeStatus: JourneyStatusFilter
  onStatusChange: (status: JourneyStatusFilter) => void
  counts: JourneyStatusCounts
}

const tabs: {
  status: JourneyStatusFilter
  label: string
  icon: React.ElementType
}[] = [
  { status: 'all', label: 'All', icon: MapPin },
  {
    status: 'visited',
    label: JOURNEY_STATUS_DETAILS.visited.label,
    icon: MapPin
  },
  {
    status: 'residence',
    label: JOURNEY_STATUS_DETAILS.residence.label,
    icon: House
  },
  {
    status: 'airport',
    label: JOURNEY_STATUS_DETAILS.airport.label,
    icon: AirplaneTakeoff
  },
  {
    status: 'wishlist',
    label: JOURNEY_STATUS_DETAILS.wishlist.label,
    icon: Heart
  }
]

export function JourneyStatusTabs({
  activeStatus,
  onStatusChange,
  counts
}: StatusTabsProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter journey locations"
    >
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeStatus === tab.status
        const count = counts[tab.status]

        return (
          <button
            key={tab.status}
            type="button"
            onClick={() => onStatusChange(tab.status)}
            aria-pressed={isActive}
            className={`flex touch-manipulation items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-neutral-400 dark:focus-visible:ring-offset-neutral-950 ${
              isActive
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            <Icon
              size={18}
              weight={isActive ? 'fill' : 'regular'}
              aria-hidden="true"
              className={
                isActive
                  ? 'text-white dark:text-black'
                  : 'text-black dark:text-white'
              }
            />
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isActive
                  ? 'bg-white/20 dark:bg-neutral-900/20'
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
