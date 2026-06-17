'use client'

import { startTransition, useEffect, useState } from 'react'
import { Title } from '~/components/title'
import { HeroTitle } from '~/components/ui/section-title'
import { ArtistCard } from './artist-card'
import { Details } from './details'
import { LoadingSongs } from './loading-songs'
import { SongCard } from './song-card'
import type { LastFmResponse } from '../types'

const LAST_FM_DATA_URL =
  'https://toshiki-home-nuxt3.netlify.app/.netlify/functions/getLastFmSongs'
const LAST_FM_CACHE_TTL_MS = 30 * 60 * 1000
const LAST_FM_PLACEHOLDER_IMAGE = '2a96cbd8b46e442fc41c2b86b821562f.png'

type CacheEntry<T> = {
  data: T
  timestamp: number
}

type SongsPageState = {
  data: LastFmResponse
  error: string | null
  isLoading: boolean
}

const emptyLastFmResponse: LastFmResponse = {
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

let songsCache: CacheEntry<LastFmResponse> | null = null
let songsRequest: Promise<LastFmResponse> | null = null

function getSongsStorageKey() {
  return 'songs:lastfm:v1'
}

function isFreshCacheEntry<T>(entry: CacheEntry<T> | null) {
  return Boolean(entry && Date.now() - entry.timestamp < LAST_FM_CACHE_TTL_MS)
}

function normalizeLastFmImage(image: string | null | undefined) {
  if (!image || image.includes(LAST_FM_PLACEHOLDER_IMAGE)) {
    return ''
  }

  return image
}

function normalizeLastFmResponse(data: LastFmResponse): LastFmResponse {
  return {
    user: {
      ...data.user,
      image: normalizeLastFmImage(data.user.image)
    },
    topTracks: data.topTracks.map(track => ({
      ...track,
      image: normalizeLastFmImage(track.image)
    })),
    recentTracks: data.recentTracks.map(track => ({
      ...track,
      image: normalizeLastFmImage(track.image)
    })),
    topArtists: data.topArtists.map(artist => ({
      ...artist,
      image: normalizeLastFmImage(artist.image)
    }))
  }
}

function readStorageCache<T>(key: string) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(key)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as CacheEntry<T>

    if (!isFreshCacheEntry(parsed)) {
      window.sessionStorage.removeItem(key)
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function writeStorageCache<T>(key: string, entry: CacheEntry<T>) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // Ignore storage failures and keep the in-memory cache.
  }
}

function getSongsCache() {
  if (songsCache && isFreshCacheEntry(songsCache)) {
    return songsCache.data
  }

  const storageEntry = readStorageCache<LastFmResponse>(getSongsStorageKey())

  if (storageEntry) {
    const normalizedEntry = {
      ...storageEntry,
      data: normalizeLastFmResponse(storageEntry.data)
    }

    songsCache = normalizedEntry
    return normalizedEntry.data
  }

  songsCache = null

  return null
}

function setSongsCache(data: LastFmResponse) {
  const entry = {
    data: normalizeLastFmResponse(data),
    timestamp: Date.now()
  }

  songsCache = entry
  writeStorageCache(getSongsStorageKey(), entry)
}

async function fetchLastFmData() {
  const response = await fetch(LAST_FM_DATA_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch LastFM data')
  }

  return normalizeLastFmResponse((await response.json()) as LastFmResponse)
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Failed to load LastFM data'
}

function createInitialState(): SongsPageState {
  const data = getSongsCache()

  return {
    data: data ?? emptyLastFmResponse,
    error: null,
    isLoading: data === null
  }
}

export function SongsPageClient() {
  const [state, setState] = useState<SongsPageState>(createInitialState)

  useEffect(() => {
    let cancelled = false

    const cachedData = getSongsCache()

    if (cachedData) {
      startTransition(() => {
        setState({
          data: cachedData,
          error: null,
          isLoading: false
        })
      })

      return () => {
        cancelled = true
      }
    }

    startTransition(() => {
      setState(current => ({
        ...current,
        isLoading: true,
        error: null
      }))
    })

    const request = songsRequest ?? fetchLastFmData()
    songsRequest = request

    request
      .then(data => {
        setSongsCache(data)

        if (!cancelled) {
          startTransition(() => {
            setState({
              data,
              error: null,
              isLoading: false
            })
          })
        }
      })
      .catch(error => {
        if (!cancelled) {
          startTransition(() => {
            setState({
              data: emptyLastFmResponse,
              error: getErrorMessage(error),
              isLoading: false
            })
          })
        }
      })
      .finally(() => {
        if (songsRequest === request) {
          songsRequest = null
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (state.isLoading) {
    return <LoadingSongs />
  }

  return (
    <div className="content-container m-auto space-y-10 md:space-y-14">
      <Title text="Songs" />
      <div className="space-y-2 pb-10 text-neutral-600 dark:text-neutral-400">
        <p>
          My latest music activity powered by Last FM. Check out the Daily Songs
          page for a fresh new recommendation!
        </p>
        {state.error ? (
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
            latest music data is unavailable right now
          </p>
        ) : null}
      </div>

      <section>
        <HeroTitle className="mb-4">Details</HeroTitle>
        <Details user={state.data.user} />
      </section>

      {state.data.topTracks.length ? (
        <section id="top-songs">
          <HeroTitle className="mb-4">Top Songs (last 7 days)</HeroTitle>
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
            {state.data.topTracks.map(song => (
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

      {state.data.topArtists.length ? (
        <section id="top-artists">
          <HeroTitle className="mb-4">Top Artists (last 7 days)</HeroTitle>
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
            {state.data.topArtists.map(artist => (
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

      {state.data.recentTracks.length ? (
        <section id="recent">
          <HeroTitle className="mb-4">Recent Songs</HeroTitle>
          <div className="overflow-x-auto">
            <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
              {state.data.recentTracks.map((song, index) => (
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
