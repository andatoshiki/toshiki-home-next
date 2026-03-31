'use client'

import { useMemo } from 'react'
import type {
  GithubActivitySnapshot,
  GithubActivityType
} from '~/lib/api/github/activity'
import {
  defaultGithubActivityTypes,
  githubActivityWindowDays,
  normalizeGithubActivityTypes
} from '~/lib/api/github/activity'
import { useGithubDataContext } from '~/components/providers/github-data-provider'

type GithubActivityDataState = {
  snapshot: GithubActivitySnapshot | null
  error: string | null
  isLoading: boolean
}

export function useGithubActivityData({
  days = githubActivityWindowDays,
  types = defaultGithubActivityTypes
}: {
  days?: number
  types?: readonly GithubActivityType[]
} = {}): GithubActivityDataState {
  const { activitySnapshot, activityError, activityDays, isActivityLoading } =
    useGithubDataContext()
  const normalizedTypes = useMemo(
    () => normalizeGithubActivityTypes(types),
    [types]
  )

  if (isActivityLoading) {
    return {
      snapshot: activitySnapshot,
      error: null,
      isLoading: true
    }
  }

  if (!activitySnapshot) {
    return {
      snapshot: null,
      error: activityError || 'Failed to load GitHub activity data',
      isLoading: false
    }
  }

  if (activityDays !== null && days !== activityDays) {
    return {
      snapshot: null,
      error: `GitHub activity data is available for ${activityDays} days, but ${days} were requested`,
      isLoading: false
    }
  }

  const availableTypes = new Set(activitySnapshot.requestedTypes)
  const requestedTypes = normalizedTypes.filter(type =>
    availableTypes.has(type)
  )

  return {
    snapshot: {
      ...activitySnapshot,
      requestedTypes: requestedTypes.length
        ? requestedTypes
        : activitySnapshot.requestedTypes
    },
    error: activityError,
    isLoading: false
  }
}
