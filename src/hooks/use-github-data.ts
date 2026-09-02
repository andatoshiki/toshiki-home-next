'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import { fetchGithubPublicSnapshot } from '~/lib/api/github/client'
import { getGithubPublicMetrics } from '~/lib/api/github/metrics'
import type {
  GithubPublicMetrics,
  GithubPublicSnapshot
} from '~/lib/api/github/types'

type GithubDataState = {
  snapshot: GithubPublicSnapshot | null
  metrics: GithubPublicMetrics | null
  error: string | null
  isLoading: boolean
}

type GithubSnapshotCacheEntry = {
  data: GithubPublicSnapshot
  timestamp: number
}

const GITHUB_QUERY_KEY = 'github:public-snapshot:v1'
const GITHUB_STORAGE_KEY = 'github:snapshot:v1'
const GITHUB_CACHE_TTL_MS = 30 * 60 * 1000

function readSnapshotCache() {
  try {
    const raw = window.sessionStorage.getItem(GITHUB_STORAGE_KEY)

    if (!raw) return null

    const entry = JSON.parse(raw) as GithubSnapshotCacheEntry

    if (Date.now() - entry.timestamp >= GITHUB_CACHE_TTL_MS) {
      window.sessionStorage.removeItem(GITHUB_STORAGE_KEY)
      return null
    }

    return entry.data
  } catch {
    return null
  }
}

function writeSnapshotCache(snapshot: GithubPublicSnapshot) {
  try {
    window.sessionStorage.setItem(
      GITHUB_STORAGE_KEY,
      JSON.stringify({ data: snapshot, timestamp: Date.now() })
    )
  } catch {
    // Keep SWR's in-memory cache when browser storage is unavailable.
  }
}

async function loadGithubSnapshot() {
  const cachedSnapshot = readSnapshotCache()

  if (cachedSnapshot) return cachedSnapshot

  const snapshot = await fetchGithubPublicSnapshot()
  writeSnapshotCache(snapshot)

  return snapshot
}

function getErrorMessage(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : 'Failed to load GitHub data'
}

export function useGithubData(): GithubDataState {
  const { data, error, isLoading } = useSWR<GithubPublicSnapshot>(
    GITHUB_QUERY_KEY,
    loadGithubSnapshot,
    {
      dedupingInterval: GITHUB_CACHE_TTL_MS,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  )
  const metrics = useMemo(
    () => (data ? getGithubPublicMetrics(data) : null),
    [data]
  )

  return {
    snapshot: data ?? null,
    metrics,
    error: error ? getErrorMessage(error) : null,
    isLoading
  }
}
