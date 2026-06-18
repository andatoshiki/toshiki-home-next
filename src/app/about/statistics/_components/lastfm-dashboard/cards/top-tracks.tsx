'use client'

import { Playlist } from '@phosphor-icons/react/dist/ssr'

import { useLastFmTopTracks } from '~/hooks/use-lastfm-data'
import type { LastFmTrack } from '~/lib/api/lastfm/types'
import { TopTracksSkeleton } from '../skeleton/top-tracks-skeleton'

const TrackItem = ({ track }: { track: LastFmTrack }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="flex flex-1 flex-col overflow-hidden">
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg leading-normal hover:underline"
      >
        {track.name}
      </a>
      <span className="text-sm leading-tight text-neutral-500">
        {track.artist}
      </span>
    </div>
    <span className="text-neutral-500">
      {track.plays?.toLocaleString() ?? 0} plays
    </span>
  </div>
)

export function TopTracks() {
  const { data, isLoading } = useLastFmTopTracks('6month', 10)

  if (isLoading) {
    return <TopTracksSkeleton />
  }

  const tracks = data?.tracks ?? []

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col leading-tight">
        <span className="inline-flex items-center gap-2 text-neutral-600">
          <span>Top Tracks</span>
          <Playlist size="1em" weight="duotone" />
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-700">
          From last 6 months
        </span>
      </div>

      <div>
        {tracks.map(track => (
          <TrackItem key={`${track.artist}-${track.name}`} track={track} />
        ))}
      </div>
    </div>
  )
}
