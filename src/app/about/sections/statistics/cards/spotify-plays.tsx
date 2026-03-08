import { SpotifyLogo } from '@phosphor-icons/react/dist/ssr'

import { Card } from '../card'
import { getLastFmUserInfo } from '~/lib/api/lastfm/lasfm'

export async function SpotifyPlays() {
  const { playcount } = await getLastFmUserInfo()

  return (
    <Card
      title="Spotify Plays"
      icon={<SpotifyLogo size="1em" weight="duotone" />}
      content={playcount}
    />
  )
}
