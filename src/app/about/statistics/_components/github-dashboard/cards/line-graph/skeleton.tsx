import { ChartLine } from '@phosphor-icons/react/dist/ssr'

export function LineGraphSkeleton() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600">
        <span>Contribution Graph</span>
        <ChartLine size="1em" weight="duotone" />
      </span>
      <div className="flex flex-col gap-2">
        <div className="h-36 w-full animate-pulse rounded-3xl bg-neutral-400 dark:bg-neutral-800" />
      </div>
    </div>
  )
}
