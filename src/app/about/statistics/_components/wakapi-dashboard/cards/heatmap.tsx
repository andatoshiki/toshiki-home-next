'use client'

import { useMemo, useState } from 'react'
import { Fire } from '@phosphor-icons/react/dist/ssr'
import WakapiHeatmap from '~/components/heatmap/wakapi-heatmap'
import { getCurrentWakapiYear, getWakapiHeatmapData } from '~/lib/api/wakapi'
import { useWakapiYearSummaries } from '../data/provider'

export function WakapiHeatmapCard() {
  const [year, setYear] = useState(getCurrentWakapiYear())
  const { data: summaries, error, isLoading } = useWakapiYearSummaries(year)
  const data = useMemo(() => getWakapiHeatmapData(summaries), [summaries])

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex flex-col leading-none">
        <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span>Coding Activity</span>
          <Fire size="1em" weight="duotone" />
        </span>
        <span className="text-xs text-neutral-600/50 dark:text-neutral-400/50">
          contribution heatmap
        </span>
      </div>
      <WakapiHeatmap
        data={data}
        year={year}
        onYearChange={setYear}
        loading={isLoading}
        error={error}
      />
    </div>
  )
}
