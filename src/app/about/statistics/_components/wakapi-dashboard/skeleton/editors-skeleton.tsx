import { Desktop } from '@phosphor-icons/react/dist/ssr'

export function EditorsSkeleton() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
        <span>Editors</span>
        <Desktop size="1em" weight="duotone" />
      </span>
      <div className="flex h-[220px] items-center justify-center">
        <div className="h-[170px] w-[170px] animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}
