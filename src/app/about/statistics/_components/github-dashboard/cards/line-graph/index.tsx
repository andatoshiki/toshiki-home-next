'use client'

import { useMemo } from 'react'
import { ChartLine } from '@phosphor-icons/react/dist/ssr'
import {
  defaultGithubActivityTypes,
  getGithubActivityLabel,
  getVisibleGithubActivitySources,
  githubActivitySourceDefinitions,
  githubActivityWindowDays
} from '~/lib/api/github/activity'
import { ApiErrorMessage } from '~/components/api-error-message'
import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
import { useGithubActivityData } from '~/hooks/use-github-activity-data'
import { Chart } from './chart'
import { LineGraphSkeleton } from './skeleton'

function ErrorState() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col gap-2 leading-none">
        <div className="flex flex-col leading-none">
          <span className="inline-flex items-center gap-2 text-neutral-600">
            <span>Contribution Breakdown</span>
            <ChartLine size="1em" weight="duotone" />
          </span>
          <span className="text-xs text-neutral-600/50">
            activity data could not be loaded
          </span>
        </div>
      </div>
      <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-red-500/20 bg-red-500/5 p-4">
        <ApiErrorMessage />
      </div>
    </div>
  )
}

function LegendItem({
  label,
  color,
  dashed
}: {
  label: string
  color: string
  dashed?: boolean
}) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-px w-4"
        style={
          dashed
            ? {
                borderTop: `1px dashed ${color}`
              }
            : {
                backgroundColor: color
              }
        }
      />
      <span>{label}</span>
    </div>
  )
}

export function LineGraph() {
  const days = githubActivityWindowDays
  const isDarkMode = useAbsoluteTheme() === 'dark'
  const { snapshot, error, isLoading } = useGithubActivityData({
    days,
    types: defaultGithubActivityTypes
  })

  const visibleSources = useMemo(
    () =>
      snapshot
        ? getVisibleGithubActivitySources(
            snapshot.series,
            snapshot.requestedTypes
          )
        : githubActivitySourceDefinitions,
    [snapshot]
  )

  if (isLoading && !snapshot) {
    return <LineGraphSkeleton />
  }

  if (error || !snapshot) {
    return <ErrorState />
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col gap-2 leading-none">
        <div className="flex flex-col leading-none">
          <span className="inline-flex items-center gap-2 text-neutral-600">
            <span>Contribution Breakdown</span>
            <ChartLine size="1em" weight="duotone" />
          </span>
          <span className="text-xs text-neutral-600/50">
            from last {days} days by type
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] text-neutral-500 dark:text-neutral-400">
          {visibleSources.map(source => (
            <LegendItem
              key={source.type}
              label={source.label}
              color={source.theme[isDarkMode ? 'dark' : 'light']}
              dashed={
                'strokeDasharray' in source && Boolean(source.strokeDasharray)
              }
            />
          ))}
        </div>
        {snapshot.failedTypes.length ? (
          <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
            partial data:{' '}
            {snapshot.failedTypes.map(getGithubActivityLabel).join(', ')}{' '}
            unavailable
          </span>
        ) : null}
      </div>
      <div className="flex h-full">
        <Chart data={snapshot.series} sources={visibleSources} />
      </div>
    </div>
  )
}
