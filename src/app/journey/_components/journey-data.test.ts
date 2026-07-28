import assert from 'node:assert/strict'
import test from 'node:test'

import { getJourneyStatusCounts, getMapLocations } from './journey-data'

test('counts every journey status and the full collection', () => {
  const counts = getJourneyStatusCounts([
    { status: 'visited' },
    { status: 'visited' },
    { status: 'residence' },
    { status: 'airport' },
    { status: 'wishlist' }
  ])

  assert.deepEqual(counts, {
    all: 5,
    visited: 2,
    residence: 1,
    airport: 1,
    wishlist: 1
  })
})

test('projects only fields rendered by the map', () => {
  const locations = getMapLocations([
    {
      id: 'tokyo-japan',
      name: 'Tokyo',
      coordinates: { longitude: 139.6917, latitude: 35.6895 },
      status: 'visited',
      description: 'Visited Tokyo'
    },
    {
      id: 'osaka-japan',
      name: 'Osaka',
      coordinates: { longitude: 135.5023, latitude: 34.6937 },
      status: 'wishlist'
    }
  ])

  assert.deepEqual(locations, [
    {
      id: 'tokyo-japan',
      name: 'Tokyo',
      coordinates: { longitude: 139.6917, latitude: 35.6895 },
      status: 'visited',
      description: 'Visited Tokyo'
    },
    {
      id: 'osaka-japan',
      name: 'Osaka',
      coordinates: { longitude: 135.5023, latitude: 34.6937 },
      status: 'wishlist'
    }
  ])
})
