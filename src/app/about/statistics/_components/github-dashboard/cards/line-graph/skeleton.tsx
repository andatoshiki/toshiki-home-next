import { ChartLine } from '@phosphor-icons/react/dist/ssr'

export function LineGraphSkeleton() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col gap-2 leading-none">
        <div className="flex flex-col leading-none">
          <span className="inline-flex items-center gap-2 text-neutral-600">
            <span>Contribution Breakdown</span>
            <ChartLine size="1em" weight="duotone" />
          </span>
          <span className="text-xs text-neutral-600/50">
            from last 30 days by type
          </span>
        </div>
        <div className="h-2.5 w-40 animate-pulse rounded bg-neutral-300 dark:bg-neutral-800" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[260px] w-full animate-pulse rounded-3xl bg-neutral-400 dark:bg-neutral-800" />
      </div>
    </div>
  )
}
