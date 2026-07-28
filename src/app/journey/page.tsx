import type { Metadata } from 'next'
import { GlobeHemisphereWest } from '@phosphor-icons/react/dist/ssr'

import { journeyLocations } from '#content'
import { Title } from '~/components/title'
import {
  getJourneyStatusCounts,
  getMapLocations
} from './_components/journey-data'
import { JourneyExplorer } from './_components/journey-explorer'
import {
  JOURNEY_STATUSES,
  JOURNEY_STATUS_DETAILS
} from './_components/journey-status'

export const metadata: Metadata = {
  title: 'Journey',
  description:
    'An interactive globe showcasing places I have visited, lived in, and dream of exploring.',
  keywords: [
    'travel',
    'journey',
    'map',
    'globe',
    'visited',
    'places',
    'wanderlust'
  ]
}

const mapLocations = getMapLocations(journeyLocations)
const statusCounts = getJourneyStatusCounts(journeyLocations)

export default function JourneyPage() {
  return (
    <div className="content-container m-auto space-y-8">
      <div className="flex items-center gap-3">
        <Title text="Journey" description="Places I've been and want to go" />
        <GlobeHemisphereWest
          aria-hidden="true"
          size={32}
          weight="duotone"
          className="text-blue-500"
        />
      </div>

      <JourneyExplorer locations={mapLocations} counts={statusCounts} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {JOURNEY_STATUSES.map(status => {
          const details = JOURNEY_STATUS_DETAILS[status]

          return (
            <div
              key={status}
              className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className={`text-2xl font-bold ${details.textClassName}`}>
                {statusCounts[status]}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {details.summaryLabel}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
