import { ErrorBoundary } from 'react-error-boundary'

import { FallbackError } from '../fallback-error'

import { TopTrack } from './cards/top-track'
import { TopTracks } from './cards/top-tracks'
import { TopArtists } from './cards/top-artists'

export function LastFmDashboard() {
  return (
    <ErrorBoundary fallback={<FallbackError />}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
        <div className="md:col-span-2">
          <TopTrack />
        </div>
        <TopTracks />

        <TopArtists />
      </div>
    </ErrorBoundary>
  )
}
