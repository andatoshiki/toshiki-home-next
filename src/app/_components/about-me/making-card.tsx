'use client'

import {
  ArrowUpRight,
  Coffee,
  DownloadSimple,
  GitFork,
  Globe,
  Star
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { GithubLogo } from '~/app/about/sections/contact/icons'
import { Date } from '~/components/date'
import { useGithubData } from '~/hooks/use-github-data'
import type { GithubRepository } from '~/lib/api/github/types'

const preferredRepositoryName = 'toshiki-home-next'

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-5 text-sm shadow-md dark:border-neutral-800">
      <header className="flex justify-between gap-3">
        <div className="flex items-center gap-1">
          <Coffee />
          <span>Currently making...</span>
        </div>
        <Link href="/projects" className="opacity-80 hover:opacity-100">
          see projects
        </Link>
      </header>
      {children}
      <div className="flex gap-4">
        <a
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-700/10 p-3 leading-none text-neutral-700 transition hover:bg-neutral-700 hover:text-white dark:bg-neutral-400/10 dark:text-neutral-400 dark:hover:bg-neutral-400 dark:hover:text-black"
          target="_blank"
          href="/assets/cv-mateus-felipe.pdf"
        >
          Download CV <DownloadSimple size="1em" />
        </a>
        <a
          className="flex items-end justify-center rounded-xl p-3 leading-none underline opacity-70 hover:opacity-100"
          target="_blank"
          href="https://read.cv/mateusfelipe/?ref=https://toshiki.dev"
        >
          <span>read.cv</span>
          <ArrowUpRight className="text-xs" size="1em" />
        </a>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <CardShell>
      <div className="space-y-3 rounded-xl border border-neutral-200 p-2 dark:border-neutral-800">
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-100 dark:bg-neutral-900" />
        </div>
        <div className="h-10 animate-pulse rounded bg-neutral-100 dark:bg-neutral-900" />
        <div className="flex gap-3">
          <div className="h-4 w-12 animate-pulse rounded bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-4 w-12 animate-pulse rounded bg-neutral-100 dark:bg-neutral-900" />
        </div>
      </div>
    </CardShell>
  )
}

function EmptyState() {
  return (
    <CardShell>
      <div className="rounded-xl border border-dashed border-neutral-200 p-4 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        repository details are unavailable right now
      </div>
    </CardShell>
  )
}

function RepoCard({ repository }: { repository: GithubRepository }) {
  return (
    <CardShell>
      <div className="space-y-3 rounded-xl border border-neutral-200 p-2 dark:border-neutral-800">
        <div>
          <div className="flex items-start justify-between gap-1">
            <div>
              <div className="font-medium">{repository.name}</div>
              <div className="text-xs opacity-80">
                <Date dateString={repository.updated_at} />
              </div>
            </div>
            <div className="inline-flex items-center text-base">
              <a
                href={repository.html_url}
                target="_blank"
                className="rounded p-1 transition hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <GithubLogo size="1em" />
              </a>
              {repository.homepage ? (
                <a
                  href={repository.homepage}
                  target="_blank"
                  className="rounded p-1 transition hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Globe size="1em" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          {repository.description || 'recent public repository activity'}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span>
              <Star size="1em" />
            </span>
            <span>{repository.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              <GitFork size="1em" />
            </span>
            <span>{repository.forks_count}</span>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

export function MakingCard() {
  const { snapshot, isLoading } = useGithubData()
  const repository =
    snapshot?.repositories.find(
      repo => repo.name === preferredRepositoryName
    ) ??
    snapshot?.repositories[0] ??
    null

  if (isLoading && !repository) {
    return <LoadingState />
  }

  if (!repository) {
    return <EmptyState />
  }

  return <RepoCard repository={repository} />
}
