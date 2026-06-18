'use client'

import { LastfmLogo } from '@phosphor-icons/react/dist/ssr'
import { useLastFmTopArtists } from '~/hooks/use-lastfm-data'

import { Card } from '../card'

export function TopArtist() {
  const { data, isLoading } = useLastFmTopArtists('6month', 1)
  const mostListened = data?.artists[0]

  return (
    <Card
      title="Top Artist"
      icon={<LastfmLogo size="1em" weight="duotone" />}
      content={
        mostListened ? (
          <a
            href={mostListened.url}
            target="_blank"
            rel="noopener noreferrer"
            title={mostListened.name}
            className="block overflow-hidden overflow-ellipsis whitespace-nowrap hover:underline"
          >
            {mostListened.name}
          </a>
        ) : isLoading ? (
          '...'
        ) : (
          'Unavailable'
        )
      }
    />
  )
}
