'use client'

import { Title } from '~/components/title'
import { HeroTitle } from '~/components/ui/section-title'
import { useLastFmNowPlaying, useLastFmSummary } from '~/hooks/use-lastfm-data'
import type { LastFmSummaryResponse } from '~/lib/api/lastfm/types'
import { ArtistCard } from './artist-card'
import { Details } from './details'
import { LoadingSongs } from './loading-songs'
import { SongCard } from './song-card'

const emptyLastFmResponse: LastFmSummaryResponse = {
  user: {
    name: 'andatoshiki',
    registered: Date.now() / 1000,
    totalPlays: 0,
    image: '',
    url: 'https://last.fm/user/andatoshiki'
  },
  topTracks: [],
  recentTracks: [],
  topArtists: []
}

export function SongsPageClient() {
  const summary = useLastFmSummary()
  const nowPlaying = useLastFmNowPlaying()

  if (summary.isLoading) {
    return <LoadingSongs />
  }

  const data = summary.data ?? emptyLastFmResponse
  let recentTracks = data.recentTracks

  if (nowPlaying.data) {
    recentTracks = recentTracks.map(track => ({ ...track, nowPlaying: false }))

    if (nowPlaying.data.track && nowPlaying.data.nowPlaying) {
      recentTracks = [
        { ...nowPlaying.data.track, nowPlaying: true },
        ...recentTracks.filter(
          track => track.url !== nowPlaying.data?.track?.url
        )
      ]
    }
  }

  return (
    <div className="content-container m-auto space-y-10 md:space-y-14">
      <Title text="Songs" />
      <div className="space-y-2 pb-10 text-neutral-600 dark:text-neutral-400">
        <p>
          My latest music activity powered by Last FM. Check out the Daily Songs
          page for a fresh new recommendation!
        </p>
        {summary.error ? (
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
            latest music data is unavailable right now
          </p>
        ) : null}
      </div>

      <section>
        <HeroTitle className="mb-4">Details</HeroTitle>
        <Details user={data.user} />
      </section>

      {data.topTracks.length ? (
        <section id="top-songs">
          <HeroTitle className="mb-4">Top Songs (last 7 days)</HeroTitle>
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
            {data.topTracks.map(song => (
              <SongCard
                key={`${song.artist}-${song.name}`}
                name={song.name}
                artist={song.artist}
                image={song.image}
                url={song.url}
                plays={song.plays}
                nowPlaying={song.nowPlaying}
              />
            ))}
          </div>
        </section>
      ) : null}

      {data.topArtists.length ? (
        <section id="top-artists">
          <HeroTitle className="mb-4">Top Artists (last 7 days)</HeroTitle>
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
            {data.topArtists.map(artist => (
              <ArtistCard
                key={artist.name}
                name={artist.name}
                plays={artist.plays}
                image={artist.image}
                url={artist.url}
              />
            ))}
          </div>
        </section>
      ) : null}

      {recentTracks.length ? (
        <section id="recent">
          <HeroTitle className="mb-4">Recent Songs</HeroTitle>
          <div className="overflow-x-auto">
            <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
              {recentTracks.map((song, index) => (
                <SongCard
                  key={`${song.artist}-${song.name}-${index}`}
                  name={song.name}
                  artist={song.artist}
                  image={song.image}
                  url={song.url}
                  nowPlaying={song.nowPlaying}
                  align="center"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
