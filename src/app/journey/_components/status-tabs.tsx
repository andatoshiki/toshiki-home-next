'use client'

import { useEffect, useState } from 'react'
import { MapPin, House, AirplaneTakeoff, Heart } from '@phosphor-icons/react'

export type JourneyStatus = 'visited' | 'residence' | 'airport' | 'wishlist'

interface StatusTabsProps {
  activeStatus: JourneyStatus | 'all'
  onStatusChange: (status: JourneyStatus | 'all') => void
  counts: Record<JourneyStatus | 'all', number>
}

const tabs: {
  status: JourneyStatus | 'all'
  label: string
  icon: React.ElementType
  color: string
}[] = [
  { status: 'all', label: 'All', icon: MapPin, color: '#a855f7' },
  { status: 'visited', label: 'Visited', icon: MapPin, color: '#f59e0b' },
  { status: 'residence', label: 'Residence', icon: House, color: '#3b82f6' },
  {
    status: 'airport',
    label: 'Airports',
    icon: AirplaneTakeoff,
    color: '#06b6d4'
  },
  { status: 'wishlist', label: 'Wishlist', icon: Heart, color: '#ec4899' }
]

export function JourneyStatusTabs({
  activeStatus,
  onStatusChange,
  counts
}: StatusTabsProps) {
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

        return (
          <button
            key={tab.status}
            onClick={() => onStatusChange(tab.status)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            <Icon
              size={18}
              weight={isActive ? 'fill' : 'regular'}
              style={{ color: iconColor }}
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

// Export color mapping for use in the map
export const STATUS_COLORS: Record<JourneyStatus, string> = {
  visited: '#f59e0b', // amber
  residence: '#3b82f6', // blue
  airport: '#06b6d4', // cyan
  wishlist: '#ec4899' // pink
}
