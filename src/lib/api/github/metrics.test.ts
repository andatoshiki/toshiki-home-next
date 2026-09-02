import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getGithubContributionSeries,
  getGithubContributionSeriesTotal,
  getGithubPublicMetrics
} from './metrics'
import type {
  GithubContributionCalendarDay,
  GithubPublicSnapshot,
  GithubRepository
} from './types'

const today = new Date(2026, 8, 1, 12)

function createRepository(
  name: string,
  language: string | null,
  stars: number
): GithubRepository {
  return {
    name,
    full_name: `andatoshiki/${name}`,
    html_url: `https://github.com/andatoshiki/${name}`,
    language,
    stargazers_count: stars,
    forks_count: 0,
    fork: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  }
}

test('builds a complete contribution window and ignores out-of-range days', () => {
  const contributions: GithubContributionCalendarDay[] = [
    { date: '2026-08-30', count: 2, level: 1 },
    { date: '2026-09-01', count: 3, level: 2 },
    { date: '2026-07-01', count: 99, level: 4 }
  ]

  const series = getGithubContributionSeries(contributions, 3, today)

  assert.deepEqual(
    series.map(day => ({ date: day.date, count: day.contributionCount })),
    [
      { date: '2026-08-30', count: 2 },
      { date: '2026-08-31', count: 0 },
      { date: '2026-09-01', count: 3 }
    ]
  )
  assert.equal(getGithubContributionSeriesTotal(series), 5)
})

test('normalizes negative contribution counts to zero', () => {
  const series = getGithubContributionSeries(
    [{ date: '2026-09-01', count: -4, level: 0 }],
    1,
    today
  )

  assert.equal(series[0].contributionCount, 0)
})

test('derives public metrics from the normalized snapshot', () => {
  const snapshot: GithubPublicSnapshot = {
    user: {
      login: 'andatoshiki',
      followers: 42,
      public_repos: 99
    },
    followers: [],
    repositories: [
      createRepository('one', 'TypeScript', 4),
      createRepository('two', 'TypeScript', 6),
      createRepository('three', 'Go', 3),
      createRepository('four', null, 2)
    ],
    contributions: [{ date: '2026-09-01', count: 5, level: 2 }],
    totalContributionsLastYear: 321
  }

  const metrics = getGithubPublicMetrics(snapshot, today)

  assert.equal(metrics.username, 'andatoshiki')
  assert.equal(metrics.followersCount, 42)
  assert.equal(metrics.repositoryCount, 4)
  assert.equal(metrics.stars, 15)
  assert.equal(metrics.languages, 2)
  assert.equal(metrics.contributionCount, 5)
  assert.equal(metrics.contributionSeries.length, 30)
  assert.equal(metrics.totalContributionsLastYear, 321)
})
