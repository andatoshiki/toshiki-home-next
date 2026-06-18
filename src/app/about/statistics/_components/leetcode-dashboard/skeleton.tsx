export function LeetcodeSkeleton() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-8 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-52 animate-pulse rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-32 animate-pulse rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-20 animate-pulse rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-7 w-20 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>

      {/* Heatmap area */}
      <div className="h-24 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
    </div>
  )
}
