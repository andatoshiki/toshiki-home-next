'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { WakapiLanguages } from './cards/languages'
import { WakapiEditors } from './cards/editors'
import { WakapiDaily } from './cards/daily'
import { WakatimeHeatmapCard } from './cards/heatmap'
import { LanguagesSkeleton } from './skeleton/languages-skeleton'
import { EditorsSkeleton } from './skeleton/editors-skeleton'
import { DailySkeleton } from './skeleton/daily-skeleton'

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
      {/* Two small cards in a row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Suspense fallback={<LanguagesSkeleton />}>
          <WakapiLanguages />
        </Suspense>
        <Suspense fallback={<EditorsSkeleton />}>
          <WakapiEditors />
        </Suspense>
      </div>
      {/* Large spanning chart */}
      <div className="mt-3">
        <Suspense fallback={<DailySkeleton />}>
          <WakapiDaily />
        </Suspense>
      </div>
      {/* Heatmap */}
      <div className="mt-3">
        <WakatimeHeatmapCard />
      </div>
    </ErrorBoundary>
  )
}
