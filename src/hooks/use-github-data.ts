'use client'

import { useEffect, useState } from 'react'
import {
  getGithubPublicMetrics,
  type GithubPublicMetrics,
  type GithubPublicSnapshot
} from '~/lib/api/github'

type GithubDataState = {
  snapshot: GithubPublicSnapshot | null
  metrics: GithubPublicMetrics | null
  error: string | null
  isLoading: boolean
}

let snapshotCache: GithubPublicSnapshot | null = null
let snapshotPromise: Promise<GithubPublicSnapshot> | null = null

async function fetchGithubSnapshot() {
  const response = await fetch('/api/github')
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to load GitHub data')
  }

  return data as GithubPublicSnapshot
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Failed to load GitHub data'
}

export function useGithubData(): GithubDataState {
  const [state, setState] = useState<GithubDataState>(() => ({
    snapshot: snapshotCache,
    metrics: snapshotCache ? getGithubPublicMetrics(snapshotCache) : null,
    error: null,
    isLoading: snapshotCache === null
  }))

  useEffect(() => {
    let cancelled = false

    if (snapshotCache) {
      setState({
        snapshot: snapshotCache,
        metrics: getGithubPublicMetrics(snapshotCache),
        error: null,
        isLoading: false
      })
      return
    }

    const request = snapshotPromise ?? fetchGithubSnapshot()
    snapshotPromise = request

    request
      .then(data => {
        snapshotCache = data

        if (!cancelled) {
          setState({
            snapshot: data,
            metrics: getGithubPublicMetrics(data),
            error: null,
            isLoading: false
          })
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({
            snapshot: null,
            metrics: null,
            error: getErrorMessage(error),
            isLoading: false
          })
        }
      })
      .finally(() => {
        if (snapshotPromise === request) {
          snapshotPromise = null
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
