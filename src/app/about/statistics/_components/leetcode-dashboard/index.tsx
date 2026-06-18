'use client'

import { useState } from 'react'
import { Info } from '@phosphor-icons/react/dist/ssr'
import { GithubContributionCalendar } from '~/components/heatmap/github-contribution-calendar'
import { useLeetcodeCalendar } from '~/hooks/use-leetcode-data'
import {
  currentLeetcodeYear,
  LEETCODE_USERNAME
} from '~/lib/api/leetcode/client'
import { LeetcodeSkeleton } from './skeleton'

const THIS_YEAR = currentLeetcodeYear()
const YEAR_OPTIONS = Array.from({ length: 4 }, (_, i) => THIS_YEAR - i)

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-sm text-neutral-500 dark:text-neutral-400">
      {label}:{' '}
      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
        {value}
      </span>
    </span>
  )
}

export function LeetcodeDashboard() {
  const [year, setYear] = useState(THIS_YEAR)
  const { data, isLoading, error } = useLeetcodeCalendar(LEETCODE_USERNAME, year)

  const isCurrentYear = year === THIS_YEAR

  if (isLoading && !data) {
    return <LeetcodeSkeleton />
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: submission count + label */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {isLoading ? (
              <span className="inline-block h-6 w-10 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              (data?.totalSubmissions ?? 0).toLocaleString()
            )}
          </span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            submissions in{' '}
            {isCurrentYear ? 'the past one year' : String(year)}
          </span>
          <Info
            size="1em"
            weight="duotone"
            className="text-neutral-400 dark:text-neutral-500"
          />
        </div>

        {/* Right: stats + borderless year picker */}
        <div className="flex items-center gap-4">
          {!isLoading && data && (
            <>
              <StatBadge label="Total active days" value={data.activeDays} />
              <StatBadge label="Max streak" value={data.maxStreak} />
            </>
          )}

          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="cursor-pointer rounded-md bg-neutral-100 px-2.5 py-1 text-sm font-medium text-neutral-700 outline-none transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Select year"
          >
            {YEAR_OPTIONS.map(y => (
              <option key={y} value={y}>
                {y === THIS_YEAR ? 'Current' : String(y)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* ── Heatmap ── */}
      <GithubContributionCalendar data={data?.days ?? []} />
    </div>
  )
}
