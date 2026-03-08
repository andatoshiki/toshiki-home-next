'use client'

import { Fire } from '@phosphor-icons/react/dist/ssr'
import WakatimeHeatmap from '~/components/heatmap/wakatime-heatmap'

export function WakatimeHeatmapCard() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col leading-none">
        <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span>Coding Activity</span>
          <Fire size="1em" weight="duotone" />
        </span>
        <span className="text-xs text-neutral-600/50 dark:text-neutral-400/50">
          contribution heatmap
        </span>
      </div>
      <div className="w-full overflow-x-auto">
        <WakatimeHeatmap />
      </div>
    </div>
  )
}
