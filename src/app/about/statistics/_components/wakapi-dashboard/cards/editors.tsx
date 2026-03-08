'use client'

import { useEffect, useState } from 'react'
import { Desktop, CaretDown } from '@phosphor-icons/react/dist/ssr'
import {
  getWakapiSummaries,
  aggregateEditors,
  WakapiDaySummary
} from '~/lib/api/wakapi'
import { EditorsChart } from '../charts/editors-chart'
import { EditorsSkeleton } from '../skeleton/editors-skeleton'

const LIMIT_OPTIONS = [3, 5, 8]

export function WakapiEditors() {
  const [data, setData] = useState<{ name: string; value: number }[]>([])
  const [limit, setLimit] = useState(5)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        const summaries = await getWakapiSummaries(30)
        const editors = aggregateEditors(summaries)
        if (mounted) {
          setData(editors)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to load Wakapi editors:', e)
        if (mounted) {
          setError('Failed to load data')
          setIsLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  if (isLoading) {
    return <EditorsSkeleton />
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
        <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span>Editors</span>
          <Desktop size="1em" weight="duotone" />
        </span>
        <div className="flex h-[220px] items-center justify-center text-neutral-500 dark:text-neutral-400">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span>Editors</span>
          <Desktop size="1em" weight="duotone" />
        </span>
        {data.length > 3 && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              Top {limit}
              <CaretDown
                size={12}
                weight="bold"
                className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`}
              />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full z-10 mt-1 rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                {LIMIT_OPTIONS.filter(
                  opt => opt <= data.length || opt === 3
                ).map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setLimit(opt)
                      setShowDropdown(false)
                    }}
                    className={`block w-full px-3 py-1 text-left text-xs transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                      limit === opt
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Top {opt}
                  </button>
                ))}
                {data.length > 8 && (
                  <button
                    onClick={() => {
                      setLimit(data.length)
                      setShowDropdown(false)
                    }}
                    className={`block w-full px-3 py-1 text-left text-xs transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                      limit === data.length
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    All ({data.length})
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex h-full items-center justify-center">
        <EditorsChart data={data} limit={limit} />
      </div>
    </div>
  )
}
