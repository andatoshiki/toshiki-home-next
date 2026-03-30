import 'server-only'

import { endOfDay, formatISO, startOfDay, subDays } from 'date-fns'
import type {
  GithubContributionCalendarDay,
  GithubFollower,
  GithubPublicSnapshot,
  GithubRepository,
  GithubUserData
} from './github'

const githubRestApiUrl = 'https://api.github.com'
const githubGraphqlApiUrl = 'https://api.github.com/graphql'
const githubUsername = process.env.GITHUB_USERNAME || 'andatoshiki'
const githubToken = process.env.GITHUB_TOKEN
const githubFollowerPreviewLimit = 100
const githubPageSize = 100

type GithubContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE'

type GithubContributionCalendarResponse = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number
        weeks: Array<{
          contributionDays: Array<{
            contributionCount: number
            contributionLevel: GithubContributionLevel
            date: string
          }>
        }>
      }
    }
  } | null
}

function createGithubHeaders() {
  const headers = new Headers({
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  })

  if (githubToken) {
    headers.set('Authorization', `Bearer ${githubToken}`)
  }

  return headers
}

function buildGithubRestUrl(
  path: string,
  searchParams?: Record<string, string | number>
) {
  const url = new URL(`${githubRestApiUrl}${path}`)

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
  }

  return url.toString()
}

async function fetchGithubRestJson<T>(
  path: string,
  searchParams?: Record<string, string | number>
): Promise<T> {
  const url = buildGithubRestUrl(path, searchParams)
  const response = await fetch(url, {
    cache: 'no-store',
    headers: createGithubHeaders()
  })

  if (!response.ok) {
    throw new Error(
      `GitHub REST request failed (${response.status} ${response.statusText}) for ${url}`
    )
  }

  return response.json()
}

async function fetchGithubGraphql<T>(
  query: string,
  variables: Record<string, string>
): Promise<T> {
  if (!githubToken) {
    throw new Error('Missing GITHUB_TOKEN for GitHub GraphQL contribution data')
  }

  const response = await fetch(githubGraphqlApiUrl, {
    cache: 'no-store',
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      query,
      variables
    })
  })

  const payload = await response.json()

  if (!response.ok || payload.errors) {
    const message =
      payload.errors?.[0]?.message ||
      `${response.status} ${response.statusText}`

    throw new Error(`GitHub GraphQL request failed: ${message}`)
  }

  return payload.data as T
}

async function fetchGithubFollowersPreview() {
  return fetchGithubRestJson<GithubFollower[]>(
    `/users/${githubUsername}/followers`,
    {
      per_page: githubFollowerPreviewLimit,
      page: 1
    }
  )
}

async function fetchGithubRepositories() {
  const repositories: GithubRepository[] = []

  for (let page = 1; ; page++) {
    const pageRepositories = await fetchGithubRestJson<GithubRepository[]>(
      `/users/${githubUsername}/repos`,
      {
        per_page: githubPageSize,
        page,
        sort: 'updated',
        type: 'owner'
      }
    )

    repositories.push(
      ...pageRepositories.filter(repository => !repository.fork)
    )

    if (pageRepositories.length < githubPageSize) {
      break
    }
  }

  return repositories
}

function mapContributionLevel(level: GithubContributionLevel) {
  switch (level) {
    case 'FIRST_QUARTILE':
      return 1
    case 'SECOND_QUARTILE':
      return 2
    case 'THIRD_QUARTILE':
      return 3
    case 'FOURTH_QUARTILE':
      return 4
    default:
      return 0
  }
}

async function fetchGithubContributionCalendar() {
  const to = endOfDay(new Date())
  const from = startOfDay(subDays(to, 364))

  const data = await fetchGithubGraphql<GithubContributionCalendarResponse>(
    `
      query UserContributionCalendar(
        $login: String!
        $from: DateTime!
        $to: DateTime!
      ) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  contributionLevel
                  date
                }
              }
            }
          }
        }
      }
    `,
    {
      login: githubUsername,
      from: formatISO(from),
      to: formatISO(to)
    }
  )

  const contributionCalendar =
    data.user?.contributionsCollection.contributionCalendar

  if (!contributionCalendar) {
    throw new Error(
      `GitHub contribution calendar not found for ${githubUsername}`
    )
  }

  const contributions: GithubContributionCalendarDay[] =
    contributionCalendar.weeks.flatMap(week =>
      week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount,
        level: mapContributionLevel(day.contributionLevel)
      }))
    )

  return {
    contributions,
    totalContributionsLastYear: contributionCalendar.totalContributions
  }
}

export async function fetchGithubSnapshot(): Promise<GithubPublicSnapshot> {
  const user = await fetchGithubRestJson<GithubUserData>(
    `/users/${githubUsername}`
  )

  const [followers, repositories, contributionCalendar] = await Promise.all([
    fetchGithubFollowersPreview(),
    fetchGithubRepositories(),
    fetchGithubContributionCalendar()
  ])

  return {
    user,
    followers,
    repositories,
    contributions: contributionCalendar.contributions,
    totalContributionsLastYear: contributionCalendar.totalContributionsLastYear
  }
}
