'use client'

import { UserList } from '@phosphor-icons/react/dist/ssr'

import { useLastFmTopArtists } from '~/hooks/use-lastfm-data'
import type { LastFmArtist } from '~/lib/api/lastfm/types'
import { TopArtistsSkeleton } from '../skeleton/top-artists.skeleton'

const ArtistItem = ({ artist }: { artist: LastFmArtist }) => (
  <div className="flex items-center justify-between gap-3 py-4">
    <a
      href={artist.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg leading-normal hover:underline"
    >
      {artist.name}
    </a>
    <span className="text-neutral-500">
      {artist.plays.toLocaleString()} plays
    </span>
  </div>
)

export function TopArtists() {
  const { data, isLoading } = useLastFmTopArtists('6month', 10)

  if (isLoading) {
    return <TopArtistsSkeleton />
  }

  const artists = data?.artists ?? []

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col leading-tight">
        <span className="inline-flex items-center gap-2 text-neutral-600">
          <span>Top Artists</span>
          <UserList size="1em" weight="duotone" />
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-700">
          From last 6 months
        </span>
      </div>

      <div>
        {artists.map(artist => (
          <ArtistItem key={artist.name} artist={artist} />
        ))}
      </div>
    </div>
  )
}
