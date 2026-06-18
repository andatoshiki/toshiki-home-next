import type {
  LastFmArtistsResponse,
  LastFmNowPlayingResponse,
  LastFmPeriod,
  LastFmSummaryResponse,
  LastFmTracksResponse,
  LastFmUserResponse
} from './types'

const DEFAULT_LASTFM_API_ENDPOINT = 'https://lastfm.andatoshiki.workers.dev'

function normalizeEndpoint(endpoint: string) {
  const value = endpoint.trim().replace(/\/+$/, '')
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

export const lastFmApiEndpoint = normalizeEndpoint(
  process.env.NEXT_PUBLIC_LASTFM_API_ENDPOINT || DEFAULT_LASTFM_API_ENDPOINT
)

export function buildLastFmUrl(
  resource: string,
  searchParams?: Record<string, string | number>
) {
  const url = new URL(`${lastFmApiEndpoint}/v1/music/${resource}`)

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

export async function fetchLastFmUrl<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Last.fm request failed (${response.status} ${response.statusText})`
    )
  }

  return response.json() as Promise<T>
}

export function getLastFmSummaryUrl() {
  return buildLastFmUrl('summary')
}

export function getLastFmUserUrl() {
  return buildLastFmUrl('user')
}

export function getLastFmNowPlayingUrl() {
  return buildLastFmUrl('now-playing')
}

export function getLastFmRecentTracksUrl(limit = 15) {
  return buildLastFmUrl('recent-tracks', { limit })
}

export function getLastFmTopTracksUrl(
  period: LastFmPeriod = '6month',
  limit = 10
) {
  return buildLastFmUrl('top-tracks', { period, limit })
}

export function getLastFmTopArtistsUrl(
  period: LastFmPeriod = '6month',
  limit = 10
) {
  return buildLastFmUrl('top-artists', { period, limit })
}

export type {
  LastFmArtistsResponse,
  LastFmNowPlayingResponse,
  LastFmPeriod,
  LastFmSummaryResponse,
  LastFmTracksResponse,
  LastFmUserResponse
} from './types'
