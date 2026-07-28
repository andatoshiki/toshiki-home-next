'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import type { MapLocation } from './journey-data'
import type { JourneyStatusCounts, JourneyStatusFilter } from './journey-status'
import { JourneyStatusTabs } from './status-tabs'

const GlobeMap = dynamic(
  () => import('./globe-map').then(module => module.GlobeMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[400px] w-full rounded-3xl border border-neutral-200 bg-[#e5e7eb] dark:border-neutral-800 dark:bg-[#0a0a0f] sm:h-[600px]"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading map…</span>
      </div>
    )
  }
)

interface JourneyExplorerProps {
  locations: MapLocation[]
  counts: JourneyStatusCounts
}

export function JourneyExplorer({ locations, counts }: JourneyExplorerProps) {
  const [activeStatus, setActiveStatus] = useState<JourneyStatusFilter>('all')

  return (
    <div className="space-y-8">
      <JourneyStatusTabs
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        counts={counts}
      />
      <GlobeMap locations={locations} activeStatus={activeStatus} />
    </div>
  )
}
