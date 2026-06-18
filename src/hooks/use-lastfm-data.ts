'use client'

import { startTransition, useEffect, useState } from 'react'
import {
  fetchLastFmUrl,
  getLastFmNowPlayingUrl,
  getLastFmRecentTracksUrl,
  getLastFmSummaryUrl,
  getLastFmTopArtistsUrl,
  getLastFmTopTracksUrl,
  getLastFmUserUrl,
  type LastFmArtistsResponse,
  type LastFmNowPlayingResponse,
  type LastFmPeriod,
  type LastFmSummaryResponse,
  type LastFmTracksResponse,
  type LastFmUserResponse
} from '~/lib/api/lastfm/client'

type QueryState<T> = {
  data: T | null
  error: string | null
  isLoading: boolean
}

type CacheEntry = {
  data: unknown
  timestamp: number
}

const queryCache = new Map<string, CacheEntry>()
const inflightQueries = new Map<string, Promise<unknown>>()

function getCachedData<T>(url: string, ttlMs: number) {
  const entry = queryCache.get(url)

  if (!entry || Date.now() - entry.timestamp >= ttlMs) {
    queryCache.delete(url)
    return null
  }

  return entry.data as T
}

function getErrorMessage(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : 'Failed to load Last.fm data'
}

function getRequest<T>(url: string) {
  const inflight = inflightQueries.get(url)

  if (inflight) {
    return inflight as Promise<T>
  }

  const request = fetchLastFmUrl<T>(url).finally(() => {
    if (inflightQueries.get(url) === request) {
      inflightQueries.delete(url)
    }
  })

  inflightQueries.set(url, request)
  return request
}

function useLastFmQuery<T>(url: string, ttlMs: number, refreshIntervalMs = 0) {
  const [state, setState] = useState<QueryState<T>>(() => {
    const data = getCachedData<T>(url, ttlMs)

    return {
      data,
      error: null,
      isLoading: data === null
    }
  })

  useEffect(() => {
    let cancelled = false

    const load = (force = false) => {
      const cachedData = force ? null : getCachedData<T>(url, ttlMs)

      if (cachedData) {
        startTransition(() => {
          setState({ data: cachedData, error: null, isLoading: false })
        })
        return
      }

      if (!force) {
        startTransition(() => {
          setState(current => ({ ...current, error: null, isLoading: true }))
        })
      }

      void getRequest<T>(url)
        .then(data => {
          queryCache.set(url, { data, timestamp: Date.now() })

          if (!cancelled) {
            startTransition(() => {
              setState({ data, error: null, isLoading: false })
            })
          }
        })
        .catch(error => {
          if (!cancelled) {
            startTransition(() => {
              setState(current => ({
                ...current,
                error: getErrorMessage(error),
                isLoading: false
              }))
            })
          }
        })
    }

    load()

    const interval = refreshIntervalMs
      ? window.setInterval(() => load(true), refreshIntervalMs)
      : null

    return () => {
      cancelled = true
      if (interval) window.clearInterval(interval)
    }
  }, [refreshIntervalMs, ttlMs, url])

  return state
}

export function useLastFmSummary() {
  return useLastFmQuery<LastFmSummaryResponse>(
    getLastFmSummaryUrl(),
    5 * 60_000
  )
}

export function useLastFmUser() {
  return useLastFmQuery<LastFmUserResponse>(getLastFmUserUrl(), 30 * 60_000)
}

export function useLastFmNowPlaying() {
  return useLastFmQuery<LastFmNowPlayingResponse>(
    getLastFmNowPlayingUrl(),
    15_000,
    30_000
  )
}

export function useLastFmRecentTracks(limit = 15) {
  return useLastFmQuery<LastFmTracksResponse>(
    getLastFmRecentTracksUrl(limit),
    60_000
  )
}

export function useLastFmTopTracks(
  period: LastFmPeriod = '6month',
  limit = 10
) {
  return useLastFmQuery<LastFmTracksResponse>(
    getLastFmTopTracksUrl(period, limit),
    30 * 60_000
  )
}

export function useLastFmTopArtists(
  period: LastFmPeriod = '6month',
  limit = 10
) {
  return useLastFmQuery<LastFmArtistsResponse>(
    getLastFmTopArtistsUrl(period, limit),
    30 * 60_000
  )
}
