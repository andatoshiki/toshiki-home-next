'use client'

import Image from 'next/image'
import { MusicNotes, StarFour } from '@phosphor-icons/react/dist/ssr'

import { useLastFmTopTracks } from '~/hooks/use-lastfm-data'
import { TopTrackSkeleton } from '../skeleton/top-track-skeleton'

export function TopTrack() {
  const { data, isLoading } = useLastFmTopTracks('1month', 1)
  const track = data?.tracks[0]

  if (isLoading) {
    return <TopTrackSkeleton />
  }

  if (!track) {
    return null
  }

  return (
    <div className="flex h-full w-full items-center justify-between gap-2 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <span className="inline-flex items-center gap-2 text-neutral-600">
          <span>Top Played</span>
          <MusicNotes size="1em" weight="duotone" />
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-700">
          From last month
        </span>
        <span className="flex h-full items-center">
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${track.name} - ${track.artist}`}
            className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-xl hover:underline md:text-3xl"
          >
            {track.name} - {track.artist}
          </a>
        </span>
      </div>
      {track.image ? (
        <Image
          src={track.image}
          alt={`${track.name} cover art`}
          width={300}
          height={300}
          className="w-11 rounded-xl md:w-24 md:rounded-3xl"
        />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-700 md:h-24 md:w-24 md:rounded-3xl">
          <StarFour size={28} weight="duotone" />
        </div>
      )}
    </div>
  )
}
