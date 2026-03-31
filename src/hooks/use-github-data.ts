'use client'

import type {
  GithubPublicMetrics,
  GithubPublicSnapshot
} from '~/lib/api/github'
import { useGithubDataContext } from '~/components/providers/github-data-provider'

type GithubDataState = {
  snapshot: GithubPublicSnapshot | null
  metrics: GithubPublicMetrics | null
  error: string | null
  isLoading: boolean
}

export function useGithubData(): GithubDataState {
  const { snapshot, metrics, snapshotError, isSnapshotLoading } =
    useGithubDataContext()

  return {
    snapshot,
    metrics,
    error: snapshotError,
    isLoading: isSnapshotLoading
  }
}
