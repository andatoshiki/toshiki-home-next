'use client'

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  getGithubPublicMetrics,
  type GithubContributionCalendarDay,
  type GithubFollower,
  type GithubPublicMetrics,
  type GithubPublicSnapshot,
  type GithubRepository,
  type GithubUserData
} from '~/lib/api/github'
import {
  buildGithubActivitySeries,
  defaultGithubActivityTypes,
  githubActivityWindowDays,
  type GithubActivityRecord,
  type GithubActivitySnapshot,
  type GithubActivityType
} from '~/lib/api/github/activity'

const GITHUB_USERNAME = 'andatoshiki'
const GITHUB_REST_API_URL = 'https://api.github.com'
const GITHUB_CONTRIBUTIONS_API_URL =
  'https://github-contributions-api.jogruber.de/v4'
const GITHUB_CACHE_TTL_MS = 30 * 60 * 1000
const GITHUB_FOLLOWER_PREVIEW_LIMIT = 100
const GITHUB_PAGE_SIZE = 100
const GITHUB_MAX_EVENTS_PAGES = 10
const GITHUB_SEARCH_RESULT_LIMIT = 1000

export const githubClientActivityDays = githubActivityWindowDays

type GithubIssueSearchItem = {
  created_at: string
}

type GithubIssueSearchResponse = {
  items: GithubIssueSearchItem[]
  total_count: number
}

type GithubPublicEvent = {
  type: string
  created_at: string
  payload?: {
    action?: string
  }
}

type GithubContributionsResponse = {
  total?: {
    lastYear?: number
  }
  contributions?: GithubContributionCalendarDay[]
}

type GithubSnapshotState = {
  snapshot: GithubPublicSnapshot | null
  error: string | null
  isLoading: boolean
}

type GithubActivityState = {
  snapshot: GithubActivitySnapshot | null
  error: string | null
  isLoading: boolean
}

type GithubDataContextValue = {
  snapshot: GithubPublicSnapshot | null
  metrics: GithubPublicMetrics | null
  snapshotError: string | null
  isSnapshotLoading: boolean
  activitySnapshot: GithubActivitySnapshot | null
  activityError: string | null
  isActivityLoading: boolean
  activityDays: number | null
}

type CacheEntry<T> = {
  data: T
  timestamp: number
}

const GithubDataContext = createContext<GithubDataContextValue | null>(null)

let snapshotCache: CacheEntry<GithubPublicSnapshot> | null = null
let snapshotRequest: Promise<GithubPublicSnapshot> | null = null
let repositoriesCache: CacheEntry<GithubRepository[]> | null = null
let repositoriesRequest: Promise<GithubRepository[]> | null = null

const activityCache = new Map<string, CacheEntry<GithubActivitySnapshot>>()
const activityRequests = new Map<string, Promise<GithubActivitySnapshot>>()

function getSnapshotStorageKey() {
  return 'github:snapshot:v1'
}

function getActivityStorageKey(days: number) {
  return `github:activity:${days}:v1`
}

function isFreshCacheEntry<T>(entry: CacheEntry<T> | null) {
  return Boolean(entry && Date.now() - entry.timestamp < GITHUB_CACHE_TTL_MS)
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

function getSnapshotCache() {
  const memoryEntry = snapshotCache

  if (memoryEntry && isFreshCacheEntry(memoryEntry)) {
    return memoryEntry.data
  }

  const storageEntry = readStorageCache<GithubPublicSnapshot>(
    getSnapshotStorageKey()
  )

  if (storageEntry) {
    snapshotCache = storageEntry
    return storageEntry.data
  }

  snapshotCache = null

  return null
}

function getActivityCache(days: number) {
  const cacheKey = getActivityStorageKey(days)
  const memoryEntry = activityCache.get(cacheKey) ?? null

  if (isFreshCacheEntry(memoryEntry)) {
    return memoryEntry!.data
  }

  const storageEntry = readStorageCache<GithubActivitySnapshot>(cacheKey)

  if (storageEntry) {
    activityCache.set(cacheKey, storageEntry)
    return storageEntry.data
  }

  activityCache.delete(cacheKey)

  return null
}

function setSnapshotCache(snapshot: GithubPublicSnapshot) {
  const entry = {
    data: snapshot,
    timestamp: Date.now()
  }

  snapshotCache = entry
  writeStorageCache(getSnapshotStorageKey(), entry)
}

function getRepositoriesCache() {
  const memoryEntry = repositoriesCache

  if (memoryEntry && isFreshCacheEntry(memoryEntry)) {
    return memoryEntry.data
  }

  repositoriesCache = null

  return null
}

function setRepositoriesCache(repositories: GithubRepository[]) {
  repositoriesCache = {
    data: repositories,
    timestamp: Date.now()
  }
}

function setActivityCache(days: number, snapshot: GithubActivitySnapshot) {
  const entry = {
    data: snapshot,
    timestamp: Date.now()
  }
  const cacheKey = getActivityStorageKey(days)

  activityCache.set(cacheKey, entry)
  writeStorageCache(cacheKey, entry)
}

function buildGithubRestUrl(
  pathName: string,
  searchParams?: Record<string, string | number>
) {
  const url = new URL(`${GITHUB_REST_API_URL}${pathName}`)

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
  }

  return url.toString()
}

async function fetchGithubRestJson<T>(
  pathName: string,
  searchParams?: Record<string, string | number>
) {
  const response = await fetch(buildGithubRestUrl(pathName, searchParams))

  if (!response.ok) {
    throw new Error(
      `GitHub request failed (${response.status} ${response.statusText})`
    )
  }

  return (await response.json()) as T
}

async function fetchGithubContributionCalendar() {
  const response = await fetch(
    `${GITHUB_CONTRIBUTIONS_API_URL}/${GITHUB_USERNAME}?y=last`
  )

  if (!response.ok) {
    throw new Error(
      `GitHub contributions request failed (${response.status} ${response.statusText})`
    )
  }

  const data = (await response.json()) as GithubContributionsResponse
  const contributions = Array.isArray(data.contributions)
    ? data.contributions
    : []

  return {
    contributions,
    totalContributionsLastYear:
      typeof data.total?.lastYear === 'number'
        ? data.total.lastYear
        : contributions.reduce((total, day) => total + day.count, 0)
  }
}

async function fetchGithubUserData() {
  return fetchGithubRestJson<GithubUserData>(`/users/${GITHUB_USERNAME}`)
}

async function fetchGithubFollowersPreview() {
  return fetchGithubRestJson<GithubFollower[]>(
    `/users/${GITHUB_USERNAME}/followers`,
    {
      per_page: GITHUB_FOLLOWER_PREVIEW_LIMIT,
      page: 1
    }
  )
}

async function fetchGithubRepositories() {
  const cachedRepositories = getRepositoriesCache()

  if (cachedRepositories) {
    return cachedRepositories
  }

  if (repositoriesRequest) {
    return repositoriesRequest
  }

  const repositories: GithubRepository[] = []

  const request = (async () => {
    for (let page = 1; ; page++) {
      const pageRepositories = await fetchGithubRestJson<GithubRepository[]>(
        `/users/${GITHUB_USERNAME}/repos`,
        {
          per_page: GITHUB_PAGE_SIZE,
          page,
          sort: 'updated',
          type: 'owner'
        }
      )

      repositories.push(
        ...pageRepositories.filter(repository => !repository.fork)
      )

      if (pageRepositories.length < GITHUB_PAGE_SIZE) {
        break
      }
    }

    setRepositoriesCache(repositories)

    return repositories
  })()

  repositoriesRequest = request

  try {
    return await request
  } finally {
    if (repositoriesRequest === request) {
      repositoriesRequest = null
    }
  }
}

function toUtcDateKey(date: Date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function getActivityWindow(days: number) {
  const now = new Date()
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  const start = addUtcDays(end, -(Math.max(days, 1) - 1))

  return {
    start,
    end
  }
}

async function fetchGithubSearchActivityRecords(
  type: Extract<GithubActivityType, 'pullRequests' | 'issues'>,
  start: Date,
  end: Date
) {
  const records: GithubActivityRecord[] = []
  const dateRange = `${toUtcDateKey(start)}..${toUtcDateKey(end)}`
  const searchQualifier = type === 'pullRequests' ? 'is:pr' : 'is:issue'
  const query = `author:${GITHUB_USERNAME} ${searchQualifier} created:${dateRange}`

  for (let page = 1; ; page++) {
    const data = await fetchGithubRestJson<GithubIssueSearchResponse>(
      '/search/issues',
      {
        q: query,
        per_page: GITHUB_PAGE_SIZE,
        page,
        sort: 'created',
        order: 'desc'
      }
    )

    records.push(
      ...data.items.map(item => ({
        type,
        occurredAt: item.created_at
      }))
    )

    if (
      page * GITHUB_PAGE_SIZE >=
      Math.min(data.total_count, GITHUB_SEARCH_RESULT_LIMIT)
    ) {
      break
    }

    if (data.items.length < GITHUB_PAGE_SIZE) {
      break
    }
  }

  return records
}

async function fetchGithubReviewActivityRecords(start: Date) {
  const records: GithubActivityRecord[] = []

  for (let page = 1; page <= GITHUB_MAX_EVENTS_PAGES; page++) {
    const events = await fetchGithubRestJson<GithubPublicEvent[]>(
      `/users/${GITHUB_USERNAME}/events/public`,
      {
        per_page: GITHUB_PAGE_SIZE,
        page
      }
    )

    if (!events.length) {
      break
    }

    for (const event of events) {
      const occurredAt = new Date(event.created_at)

      if (Number.isNaN(occurredAt.getTime())) {
        continue
      }

      if (occurredAt < start) {
        return records
      }

      if (
        event.type === 'PullRequestReviewEvent' &&
        event.payload?.action === 'created'
      ) {
        records.push({
          type: 'reviews',
          occurredAt: event.created_at
        })
      }
    }

    if (events.length < GITHUB_PAGE_SIZE) {
      break
    }
  }

  return records
}

function getGithubRepositoryActivityRecords(
  repositories: GithubRepository[],
  start: Date
) {
  return repositories
    .filter(repository => new Date(repository.created_at) >= start)
    .map<GithubActivityRecord>(repository => ({
      type: 'repositories',
      occurredAt: repository.created_at,
      repositoryName: repository.full_name
    }))
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Failed to load GitHub data'
}

async function loadGithubSnapshot() {
  const [userResult, followersResult, repositoriesResult, calendarResult] =
    await Promise.allSettled([
      fetchGithubUserData(),
      fetchGithubFollowersPreview(),
      fetchGithubRepositories(),
      fetchGithubContributionCalendar()
    ])

  if (userResult.status !== 'fulfilled') {
    throw userResult.reason
  }

  if (followersResult.status !== 'fulfilled') {
    throw followersResult.reason
  }

  if (repositoriesResult.status !== 'fulfilled') {
    throw repositoriesResult.reason
  }

  return {
    user: userResult.value,
    followers: followersResult.value,
    repositories: repositoriesResult.value,
    contributions:
      calendarResult.status === 'fulfilled'
        ? calendarResult.value.contributions
        : [],
    totalContributionsLastYear:
      calendarResult.status === 'fulfilled'
        ? calendarResult.value.totalContributionsLastYear
        : 0
  } satisfies GithubPublicSnapshot
}

async function loadGithubActivitySnapshot(days = githubClientActivityDays) {
  const { start, end } = getActivityWindow(days)
  const requestedTypes = [...defaultGithubActivityTypes]
  const repositoriesPromise = fetchGithubRepositories()

  const sourceResults = await Promise.allSettled(
    requestedTypes.map(async type => {
      const records =
        type === 'pullRequests' || type === 'issues'
          ? await fetchGithubSearchActivityRecords(type, start, end)
          : type === 'reviews'
            ? await fetchGithubReviewActivityRecords(start)
            : getGithubRepositoryActivityRecords(
                await repositoriesPromise,
                start
              )

      return {
        type,
        records
      }
    })
  )

  const successfulRecords = sourceResults.flatMap(result =>
    result.status === 'fulfilled' ? result.value.records : []
  )
  const failedTypes = sourceResults.flatMap((result, index) =>
    result.status === 'rejected' ? [requestedTypes[index]] : []
  )

  if (!successfulRecords.length && failedTypes.length) {
    throw new Error('Failed to load GitHub activity data')
  }

  return {
    requestedTypes,
    failedTypes,
    series: buildGithubActivitySeries(successfulRecords, days)
  } satisfies GithubActivitySnapshot
}

function createInitialSnapshotState(): GithubSnapshotState {
  const snapshot = getSnapshotCache()

  return {
    snapshot,
    error: null,
    isLoading: snapshot === null
  }
}

function createInitialActivityState(
  includeActivity: boolean,
  days: number
): GithubActivityState {
  if (!includeActivity) {
    return {
      snapshot: null,
      error: null,
      isLoading: false
    }
  }

  const snapshot = getActivityCache(days)

  return {
    snapshot,
    error: null,
    isLoading: snapshot === null
  }
}

export function GithubDataProvider({
  children,
  includeActivity = false
}: {
  children: ReactNode
  includeActivity?: boolean
}) {
  const activityDays = includeActivity ? githubClientActivityDays : null

  const [snapshotState, setSnapshotState] = useState<GithubSnapshotState>(
    createInitialSnapshotState
  )
  const [activityState, setActivityState] = useState<GithubActivityState>(() =>
    createInitialActivityState(includeActivity, githubClientActivityDays)
  )

  useEffect(() => {
    let cancelled = false

    const cachedSnapshot = getSnapshotCache()

    if (cachedSnapshot) {
      startTransition(() => {
        setSnapshotState({
          snapshot: cachedSnapshot,
          error: null,
          isLoading: false
        })
      })
    } else {
      startTransition(() => {
        setSnapshotState(current => ({
          ...current,
          isLoading: true,
          error: null
        }))
      })

      const request = snapshotRequest ?? loadGithubSnapshot()
      snapshotRequest = request

      request
        .then(snapshot => {
          setSnapshotCache(snapshot)

          if (!cancelled) {
            startTransition(() => {
              setSnapshotState({
                snapshot,
                error: null,
                isLoading: false
              })
            })
          }
        })
        .catch(error => {
          if (!cancelled) {
            startTransition(() => {
              setSnapshotState({
                snapshot: null,
                error: getErrorMessage(error),
                isLoading: false
              })
            })
          }
        })
        .finally(() => {
          if (snapshotRequest === request) {
            snapshotRequest = null
          }
        })
    }

    if (!includeActivity) {
      startTransition(() => {
        setActivityState({
          snapshot: null,
          error: null,
          isLoading: false
        })
      })

      return () => {
        cancelled = true
      }
    }

    const cachedActivity = getActivityCache(githubClientActivityDays)

    if (cachedActivity) {
      startTransition(() => {
        setActivityState({
          snapshot: cachedActivity,
          error: null,
          isLoading: false
        })
      })

      return () => {
        cancelled = true
      }
    }

    startTransition(() => {
      setActivityState(current => ({
        ...current,
        isLoading: true,
        error: null
      }))
    })

    const activityCacheKey = getActivityStorageKey(githubClientActivityDays)
    const request =
      activityRequests.get(activityCacheKey) ??
      loadGithubActivitySnapshot(githubClientActivityDays)

    activityRequests.set(activityCacheKey, request)

    request
      .then(snapshot => {
        setActivityCache(githubClientActivityDays, snapshot)

        if (!cancelled) {
          startTransition(() => {
            setActivityState({
              snapshot,
              error: null,
              isLoading: false
            })
          })
        }
      })
      .catch(error => {
        if (!cancelled) {
          startTransition(() => {
            setActivityState({
              snapshot: null,
              error: getErrorMessage(error),
              isLoading: false
            })
          })
        }
      })
      .finally(() => {
        if (activityRequests.get(activityCacheKey) === request) {
          activityRequests.delete(activityCacheKey)
        }
      })

    return () => {
      cancelled = true
    }
  }, [includeActivity])

  const value = useMemo<GithubDataContextValue>(
    () => ({
      snapshot: snapshotState.snapshot,
      metrics: snapshotState.snapshot
        ? getGithubPublicMetrics(snapshotState.snapshot)
        : null,
      snapshotError: snapshotState.error,
      isSnapshotLoading: snapshotState.isLoading,
      activitySnapshot: activityState.snapshot,
      activityError: activityState.error,
      isActivityLoading: activityState.isLoading,
      activityDays
    }),
    [activityDays, activityState, snapshotState]
  )

  return (
    <GithubDataContext.Provider value={value}>
      {children}
    </GithubDataContext.Provider>
  )
}

export function useGithubDataContext() {
  const context = useContext(GithubDataContext)

  if (!context) {
    throw new Error(
      'useGithubDataContext must be used within GithubDataProvider'
    )
  }

  return context
}
