'use client'

import { LastfmLogo } from '@phosphor-icons/react/dist/ssr'

import { Card } from '../card'
import { useLastFmUser } from '~/hooks/use-lastfm-data'

export function LastFmPlays() {
  const { data, isLoading } = useLastFmUser()
  const plays = data?.user.totalPlays

  return (
    <Card
      title="Last.fm Plays"
      icon={<LastfmLogo size="1em" weight="duotone" />}
      content={isLoading ? '...' : plays?.toLocaleString() ?? 'Unavailable'}
    />
  )
}
