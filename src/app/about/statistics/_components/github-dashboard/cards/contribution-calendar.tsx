'use client'

import { CalendarBlank } from '@phosphor-icons/react/dist/ssr'
import type { GithubContributionCalendarDay } from '~/lib/api/github'
import { GithubContributionCalendar } from '~/components/heatmap/github-contribution-calendar'

export function ContributionCalendar({
  contributions,
  totalContributions
}: {
  contributions: GithubContributionCalendarDay[]
  totalContributions: number
}) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col leading-none">
        <span className="inline-flex items-center gap-2 text-neutral-600">
          <span>Contribution Calendar</span>
          <CalendarBlank size="1em" weight="duotone" />
        </span>
        <span className="text-xs text-neutral-600/50">
          {totalContributions.toLocaleString()} contributions in the last year
        </span>
      </div>
      <GithubContributionCalendar data={contributions} />
    </div>
  )
}
