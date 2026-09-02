import type { GithubContributionCalendarDay } from './types'

const DEFAULT_GITHUB_CONTRIBUTIONS_API_ENDPOINT =
  'https://github-contributions-api.jogruber.de/v4'

type GithubContributionsResponse = {
  total?: {
    lastYear?: number
  }
  contributions?: GithubContributionCalendarDay[]
}

function normalizeEndpoint(endpoint: string) {
  const value = endpoint.trim().replace(/\/+$/, '')
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

export function buildGithubContributionUrl(username: string) {
  const endpoint = normalizeEndpoint(
    process.env.NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_ENDPOINT ||
      DEFAULT_GITHUB_CONTRIBUTIONS_API_ENDPOINT
  )
  const url = new URL(`${endpoint}/${encodeURIComponent(username)}`)

  url.searchParams.set('y', 'last')

  return url.toString()
}

export async function fetchGithubContributionCalendar(
  username: string,
  fetcher: typeof fetch = fetch
) {
  const response = await fetcher(buildGithubContributionUrl(username))

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
