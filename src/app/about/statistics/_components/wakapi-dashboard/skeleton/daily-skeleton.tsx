import { ChartLine } from '@phosphor-icons/react/dist/ssr'

export function DailySkeleton() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col leading-none">
        <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span>Daily Coding Time</span>
          <ChartLine size="1em" weight="duotone" />
        </span>
        <span className="text-xs text-neutral-600/50 dark:text-neutral-400/50">
          showing full available range
        </span>
      </div>
      <div className="flex h-[220px] w-full items-center justify-center">
        <div className="h-full w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}
