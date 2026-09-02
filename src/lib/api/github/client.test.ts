import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildGithubRestUrl,
  fetchGithubPublicSnapshot,
  fetchGithubRepositories
} from './client'
import {
  buildGithubContributionUrl,
  fetchGithubContributionCalendar
} from './contribution'
import type { GithubRepository } from './types'

function jsonResponse(data: unknown, status = 200, statusText = 'OK') {
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: { 'Content-Type': 'application/json' }
  })
}

function createRepository(index: number, fork = false): GithubRepository {
  const name = `repo-${index}`

  return {
    name,
    full_name: `andatoshiki/${name}`,
    html_url: `https://github.com/andatoshiki/${name}`,
    language: 'TypeScript',
    stargazers_count: index,
    forks_count: 0,
    fork,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  }
}

test('builds official GitHub REST URLs with encoded query parameters', () => {
  const url = new URL(
    buildGithubRestUrl('/search/issues', {
      q: 'author:andatoshiki is:issue',
      per_page: 100
    })
  )

  assert.equal(url.origin, 'https://api.github.com')
  assert.equal(url.pathname, '/search/issues')
  assert.equal(url.searchParams.get('q'), 'author:andatoshiki is:issue')
  assert.equal(url.searchParams.get('per_page'), '100')
})

test('keeps the contribution source explicit and requests the last year', () => {
  const url = new URL(buildGithubContributionUrl('anda toshiki'))

  assert.equal(url.hostname, 'github-contributions-api.jogruber.de')
  assert.equal(url.pathname, '/v4/anda%20toshiki')
  assert.equal(url.searchParams.get('y'), 'last')
})

test('calculates the contribution total when the upstream total is absent', async () => {
  const fetcher = (async () =>
    jsonResponse({
      contributions: [
        { date: '2026-08-31', count: 2, level: 1 },
        { date: '2026-09-01', count: 4, level: 2 }
      ]
    })) as typeof fetch

  const result = await fetchGithubContributionCalendar('andatoshiki', fetcher)

  assert.equal(result.totalContributionsLastYear, 6)
  assert.equal(result.contributions.length, 2)
})

test('paginates repositories and removes forks', async () => {
  const requests: string[] = []
  const firstPage = Array.from({ length: 100 }, (_, index) =>
    createRepository(index, index === 5)
  )
  const fetcher = (async (input: RequestInfo | URL) => {
    const url = String(input)
    requests.push(url)

    return jsonResponse(
      url.includes('page=2') ? [createRepository(100)] : firstPage
    )
  }) as typeof fetch

  const repositories = await fetchGithubRepositories(fetcher)

  assert.equal(requests.length, 2)
  assert.equal(repositories.length, 100)
  assert.equal(
    repositories.some(repository => repository.fork),
    false
  )
  assert.equal(repositories.at(-1)?.name, 'repo-100')
})

test('keeps core GitHub data when the contribution service is unavailable', async () => {
  const fetcher = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input))

    if (url.hostname === 'github-contributions-api.jogruber.de') {
      return jsonResponse({ error: true }, 503, 'Service Unavailable')
    }

    if (url.pathname.endsWith('/followers')) {
      return jsonResponse([
        {
          login: 'follower',
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/follower'
        }
      ])
    }

    if (url.pathname.endsWith('/repos')) {
      return jsonResponse([createRepository(1)])
    }

    return jsonResponse({
      login: 'andatoshiki',
      followers: 1,
      public_repos: 1
    })
  }) as typeof fetch

  const snapshot = await fetchGithubPublicSnapshot(fetcher)

  assert.equal(snapshot.user.login, 'andatoshiki')
  assert.equal(snapshot.followers.length, 1)
  assert.equal(snapshot.repositories.length, 1)
  assert.deepEqual(snapshot.contributions, [])
  assert.equal(snapshot.totalContributionsLastYear, 0)
})

test('fails the snapshot when required GitHub profile data is unavailable', async () => {
  const fetcher = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input))

    if (url.pathname === '/users/andatoshiki') {
      return jsonResponse({ error: true }, 500, 'Internal Server Error')
    }

    return jsonResponse([])
  }) as typeof fetch

  await assert.rejects(
    fetchGithubPublicSnapshot(fetcher),
    /GitHub request failed \(500 Internal Server Error\)/
  )
})
