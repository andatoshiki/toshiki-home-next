import type { LastFmNowPlayingResponse } from '~/lib/api/lastfm/types'

export type NowPlayingCard =
  | {
      kind: 'track'
      title: string
      artist: string
      url: string
      image: string | null
      caption: string
    }
  | {
      kind: 'placeholder'
      title: string
      artist: string
      caption: string
      pending: boolean
    }

const UNKNOWN = { title: 'Unknown', artist: 'Unknown artist' }

/**
 * Decides what the home music card shows. The now-playing feed returns the
 * latest scrobble, flagged `nowPlaying` only while it is still playing.
 */
export function getNowPlayingCard(
  data: LastFmNowPlayingResponse | null,
  isLoading: boolean
): NowPlayingCard {
  const track = data?.track

  if (track) {
    return {
      kind: 'track',
      title: track.name,
      artist: track.artist,
      url: track.url,
      image: track.image || null,
      caption: data.nowPlaying ? 'Currently listening' : 'Last listened'
    }
  }

  if (isLoading) {
    return {
      kind: 'placeholder',
      ...UNKNOWN,
      caption: 'Loading',
      pending: true
    }
  }

  return {
    kind: 'placeholder',
    ...UNKNOWN,
    caption: 'Not available',
    pending: false
  }
}
