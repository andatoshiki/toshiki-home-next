import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { WakatimeLanguagesChart } from './cards/languages'
import { WakatimeDailyBarChart } from './cards/daily'
import { WakatimeProjectsTreemap } from './cards/projects'
import { WakatimeHeatmapCard } from './cards/heatmap'
export function WakatimeDashboard() {
  return (
    <ErrorBoundary fallback={<div>Failed to load WakaTime stats.</div>}>
      <Suspense
        fallback={
          <div className="h-40 w-full animate-pulse rounded-3xl bg-neutral-200 dark:bg-neutral-900" />
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <WakatimeLanguagesChart />
          <WakatimeProjectsTreemap />
          {/* Add more WakaTime charts here as you build them */}
        </div>
        <div className="mt-3">
          <WakatimeDailyBarChart />
        </div>
        <div className="mt-3">
          <WakatimeHeatmapCard />
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
