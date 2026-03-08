import { Metadata } from 'next'
import { Title } from '~/components/title'
import { HeroTitle } from '~/components/ui/section-title'
import { Details } from './_components/details'
import { SongCard } from './_components/song-card'
import { ArtistCard } from './_components/artist-card'
import { LastFmResponse } from './types'

export const metadata: Metadata = {
  title: 'Songs',
  description:
    'My latest music activity powered by Last FM. Check out the Daily Songs page for a fresh new recommendation!',
  keywords: ['music', 'songs', 'lastfm', 'listening', 'activity']
}

export const revalidate = 3600 // 1 hour

async function getLastFmData(): Promise<LastFmResponse> {
  const url =
    'https://toshiki-home-nuxt3.netlify.app/.netlify/functions/getLastFmSongs'

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch LastFM data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching LastFM data:', error)
    // Return empty data structure as fallback
    return {
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
  }
}

export default async function Page() {
  const lastFm = await getLastFmData()

  return (
    <div className="content-vertical-spaces content-container m-auto space-y-10 md:space-y-14">
      <Title text="Songs" />
      <div className="pb-10 text-neutral-600 dark:text-neutral-400">
        <p>
          My latest music activity powered by Last FM. Check out the Daily Songs
          page for a fresh new recommendation!
        </p>
      </div>

      <section>
        <HeroTitle className="mb-4">Details</HeroTitle>
        <Details user={lastFm.user} />
      </section>

      {lastFm.topTracks.length > 0 && (
        <section id="top-songs">
          <HeroTitle className="mb-4">Top Songs (last 7 days)</HeroTitle>
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
            {lastFm.topTracks.map(song => (
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
      )}

      {lastFm.topArtists.length > 0 && (
        <section id="top-artists">
          <HeroTitle className="mb-4">Top Artists (last 7 days)</HeroTitle>
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
            {lastFm.topArtists.map(artist => (
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
      )}

      {lastFm.recentTracks.length > 0 && (
        <section id="recent">
          <HeroTitle className="mb-4">Recent Songs</HeroTitle>
          <div className="overflow-x-auto">
            <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
              {lastFm.recentTracks.map((song, index) => (
                <SongCard
                  key={`${song.artist}-${song.name}-${index}`}
                  name={song.name}
                  artist={song.artist}
                  image={song.image}
                  url={song.url}
                  nowPlaying={song.nowPlaying}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
