'use client'

import { ErrorBoundary } from 'react-error-boundary'
import { WakapiLanguages } from './cards/languages'
import { WakapiEditors } from './cards/editors'
import { WakapiDaily } from './cards/daily'
import { WakapiHeatmapCard } from './cards/heatmap'
import { WakapiDataProvider } from './data/provider'

function FallbackError({ error }: { error: Error }) {
  return (
    <div className="flex h-40 w-full items-center justify-center rounded-3xl border border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
      <p>Failed to load Wakapi stats.</p>
    </div>
  )
}

export function WakapiDashboard() {
  return (
    <ErrorBoundary FallbackComponent={FallbackError}>
      <WakapiDataProvider>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <WakapiLanguages />
          <WakapiEditors />
        </div>
        <div className="mt-3">
          <WakapiDaily />
        </div>
        <div className="mt-3">
          <WakapiHeatmapCard />
        </div>
      </WakapiDataProvider>
    </ErrorBoundary>
  )
}
