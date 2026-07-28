import type { JourneyLocation } from '#content'

import {
  JOURNEY_STATUSES,
  type JourneyStatus,
  type JourneyStatusCounts
} from './journey-status'

type JourneyMapSource = Pick<
  JourneyLocation,
  'id' | 'name' | 'coordinates' | 'status' | 'description'
>

export interface MapLocation {
  id: string
  name: string
  coordinates: {
    longitude: number
    latitude: number
  }
  status: JourneyStatus
  description?: string
}

export function getMapLocations(
  locations: readonly JourneyMapSource[]
): MapLocation[] {
  return locations.map(({ id, name, coordinates, status, description }) => ({
    id,
    name,
    coordinates,
    status,
    ...(description ? { description } : {})
  }))
}

export function getJourneyStatusCounts(
  locations: readonly Pick<JourneyLocation, 'status'>[]
): JourneyStatusCounts {
  const counts = Object.fromEntries([
    ['all', locations.length],
    ...JOURNEY_STATUSES.map(status => [status, 0])
  ]) as JourneyStatusCounts

  for (const location of locations) counts[location.status]++

  return counts
}
