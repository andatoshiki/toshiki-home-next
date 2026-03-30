import { ChartLine } from '@phosphor-icons/react/dist/ssr'
import {
  githubContributionWindowDays,
  type GithubContributionActivityDay
} from '~/lib/api/github'
import { Chart } from './chart'

export function LineGraph({ data }: { data: GithubContributionActivityDay[] }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col leading-none">
        <span className="inline-flex items-center gap-2 text-neutral-600">
          <span>Contribution Activity</span>
          <ChartLine size="1em" weight="duotone" />
        </span>
        <span className="text-xs text-neutral-600/50">
          from last {githubContributionWindowDays} days
        </span>
      </div>
      <div className="flex h-full items-center">
        <Chart data={data} />
      </div>
    </div>
  )
}
