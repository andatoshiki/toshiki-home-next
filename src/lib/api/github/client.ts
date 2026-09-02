import { fetchGithubContributionCalendar } from './contribution'
import type {
  GithubFollower,
  GithubPublicSnapshot,
  GithubRepository,
  GithubUserData
} from './types'

const DEFAULT_GITHUB_REST_API_ENDPOINT = 'https://api.github.com'
const GITHUB_FOLLOWER_PREVIEW_LIMIT = 100
const GITHUB_PAGE_SIZE = 100

export const githubUsername =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'andatoshiki'

function normalizeEndpoint(endpoint: string) {
  const value = endpoint.trim().replace(/\/+$/, '')
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

export function buildGithubRestUrl(
  pathName: string,
  searchParams?: Record<string, string | number>
) {
  const endpoint = normalizeEndpoint(
    process.env.NEXT_PUBLIC_GITHUB_API_ENDPOINT ||
      DEFAULT_GITHUB_REST_API_ENDPOINT
  )
  const url = new URL(`${endpoint}${pathName}`)

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

export async function fetchGithubRestJson<T>(
  pathName: string,
  searchParams?: Record<string, string | number>,
  fetcher: typeof fetch = fetch
) {
  const response = await fetcher(buildGithubRestUrl(pathName, searchParams))

  if (!response.ok) {
    throw new Error(
      `GitHub request failed (${response.status} ${response.statusText})`
    )
  }

  return (await response.json()) as T
}

export function fetchGithubUserData(fetcher: typeof fetch = fetch) {
  return fetchGithubRestJson<GithubUserData>(
    `/users/${githubUsername}`,
    undefined,
    fetcher
  )
}

export function fetchGithubFollowersPreview(fetcher: typeof fetch = fetch) {
  return fetchGithubRestJson<GithubFollower[]>(
    `/users/${githubUsername}/followers`,
    {
      per_page: GITHUB_FOLLOWER_PREVIEW_LIMIT,
      page: 1
    },
    fetcher
  )
}

export async function fetchGithubRepositories(fetcher: typeof fetch = fetch) {
  const repositories: GithubRepository[] = []

  for (let page = 1; ; page++) {
    const pageRepositories = await fetchGithubRestJson<GithubRepository[]>(
      `/users/${githubUsername}/repos`,
      {
        per_page: GITHUB_PAGE_SIZE,
        page,
        sort: 'updated',
        type: 'owner'
      },
      fetcher
    )

    repositories.push(
      ...pageRepositories.filter(repository => !repository.fork)
    )

    if (pageRepositories.length < GITHUB_PAGE_SIZE) {
      return repositories
    }
  }
}

export async function fetchGithubPublicSnapshot(
  fetcher: typeof fetch = fetch
): Promise<GithubPublicSnapshot> {
  const [userResult, followersResult, repositoriesResult, calendarResult] =
    await Promise.allSettled([
      fetchGithubUserData(fetcher),
      fetchGithubFollowersPreview(fetcher),
      fetchGithubRepositories(fetcher),
      fetchGithubContributionCalendar(githubUsername, fetcher)
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
  }
}
