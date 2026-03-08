'use client'

import { useState, useMemo } from 'react'
import { GlobeHemisphereWest } from '@phosphor-icons/react'
import { Title } from '~/components/title'
import { journeyLocations } from '.velite'
import {
  JourneyStatusTabs,
  JourneyStatus,
  GlobeMap,
  LocationData
} from './_components'

// Transform velite data to LocationData format
function getJourneyLocations(): LocationData[] {
  return journeyLocations.map(loc => ({
    id: loc.id,
    name: loc.name,
    coordinates: loc.coordinates,
    country: loc.country,
    region: loc.region,
    city: loc.city,
    status: loc.status as JourneyStatus,
    visitDate: loc.visitDate,
    description: loc.description,
    tags: loc.tags,
    featured: loc.featured
  }))
}

export default function JourneyPage() {
  const [activeStatus, setActiveStatus] = useState<JourneyStatus | 'all'>('all')
  const locations = useMemo(() => getJourneyLocations(), [])

  // Calculate counts for each status
  const counts = useMemo(() => {
    const result: Record<JourneyStatus | 'all', number> = {
      all: locations.length,
      visited: 0,
      residence: 0,
      airport: 0,
      wishlist: 0
    }

    locations.forEach(loc => {
      result[loc.status]++
    })

    return result
  }, [locations])

  return (
    <div className="content-container content-vertical-spaces m-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <Title text="Journey" description="Places I've been and want to go" />
          <GlobeHemisphereWest
            size={32}
            weight="duotone"
            className="text-blue-500"
          />
        </div>
      </div>

      <JourneyStatusTabs
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        counts={counts}
      />

      <GlobeMap locations={locations} activeStatus={activeStatus} />

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="text-2xl font-bold text-amber-500">
            {counts.visited}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Places Visited
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="text-2xl font-bold text-blue-500">
            {counts.residence}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Residences
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="text-2xl font-bold text-cyan-500">
            {counts.airport}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Airports
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="text-2xl font-bold text-pink-500">
            {counts.wishlist}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Wishlist
          </div>
        </div>
      </div>
    </div>
  )
}
