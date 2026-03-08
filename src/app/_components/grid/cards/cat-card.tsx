import { Cat } from '../../../../components/ui/cat'
import { Ripple } from '../../../../components/ui/ripple'

export function CatCard() {
  return (
    <div className="relative flex h-full min-h-[8rem] w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 p-0 transition-all duration-500 hover:scale-[.97] dark:border-neutral-900 dark:from-neutral-1000 dark:to-neutral-950">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        style={{ width: 140, height: 140 }}
      >
        <Ripple />
      </div>
      <Cat size={100} />
    </div>
  )
}
