import { Star } from '@phosphor-icons/react/dist/ssr'

export function Stars({ stars }: { stars: number }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600">
        <span>Stars</span>
        <Star size="1em" weight="duotone" />
      </span>
      <div className="flex h-full items-center text-2xl">{stars}</div>
    </div>
  )
}
