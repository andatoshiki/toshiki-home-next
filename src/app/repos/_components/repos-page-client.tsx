'use client'

import { useMemo } from 'react'
import { useGithubData } from '~/hooks/use-github-data'
import { RepositoryCard } from './repository-card'

const hiddenRepositoryNames = new Set([
  'andatoshiki',
  'toshiki',
  'andatoshiki.github.io',
  'dev',
  'toshikidev',
  'shikiology'
])

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="flex h-48 animate-pulse flex-col rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="mb-4 h-5 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="mb-3 h-4 w-full rounded bg-neutral-100 dark:bg-neutral-900" />
          <div className="mb-6 h-4 w-4/5 rounded bg-neutral-100 dark:bg-neutral-900" />
          <div className="mt-auto space-y-2">
            <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-900" />
            <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-900" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      {message}
    </div>
  )
}

export function ReposPageClient() {
  const { snapshot, error, isLoading } = useGithubData()

  const repositories = useMemo(() => {
    if (!snapshot) {
      return []
    }

    return [...snapshot.repositories]
      .filter(repository => !hiddenRepositoryNames.has(repository.name))
      .sort((left, right) => {
        const starsDelta = right.stargazers_count - left.stargazers_count

        if (starsDelta !== 0) {
          return starsDelta
        }

        return (
          new Date(right.updated_at).getTime() -
          new Date(left.updated_at).getTime()
        )
      })
  }, [snapshot])

  return (
    <div className="content-container m-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">Repositories</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        My public projects on GitHub.
      </p>

      {isLoading && !snapshot ? <LoadingGrid /> : null}

      {!isLoading && error ? <EmptyState message={error} /> : null}

      {!isLoading && !error && !repositories.length ? (
        <EmptyState message="No public repositories are available right now." />
      ) : null}

      {!isLoading && repositories.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {repositories.map((repository, index) => (
            <RepositoryCard
              key={repository.full_name}
              name={repository.name}
              language={repository.language}
              stars={repository.stargazers_count}
              license={repository.license?.spdx_id || null}
              description={repository.description || ''}
              htmlUrl={repository.html_url}
              top={index === 0}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
