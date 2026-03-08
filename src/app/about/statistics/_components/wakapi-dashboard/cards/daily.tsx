'use client'

import { useEffect, useState } from 'react'
import { ChartLine, CaretDown } from '@phosphor-icons/react/dist/ssr'
import * as Slider from '@radix-ui/react-slider'
import {
  getWakapiSummariesByYear,
  getDailyCodingData,
  WakapiDaySummary
} from '~/lib/api/wakapi'
import { DailyChart } from '../charts/daily-chart'
import { DailySkeleton } from '../skeleton/daily-skeleton'

interface DailyData {
  date: string
  shortDate: string
  totalSeconds: number
  hours: number
  text: string
}

// Generate available years (from 2022 to current year)
const currentYear = new Date().getFullYear()
const AVAILABLE_YEARS = Array.from(
  { length: currentYear - 2021 },
  (_, i) => currentYear - i
)

export function WakapiDaily() {
  const [allData, setAllData] = useState<DailyData[]>([])
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [days, setDays] = useState(30)
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      setIsLoading(true)
      try {
        const summaries = await getWakapiSummariesByYear(selectedYear)
        const dailyData = getDailyCodingData(summaries)
        if (mounted) {
          setAllData(dailyData)
          // Reset days to show all data or 30 days, whichever is smaller
          setDays(Math.min(30, dailyData.length))
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to load Wakapi daily data:', e)
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
  }, [selectedYear])

  if (isLoading) {
    return <DailySkeleton />
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
        <div className="flex flex-col leading-none">
          <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <span>Daily Coding Time</span>
            <ChartLine size="1em" weight="duotone" />
          </span>
          <span className="text-xs text-neutral-600/50 dark:text-neutral-400/50">
            from last 30 days
          </span>
        </div>
        <div className="flex h-[220px] items-center justify-center text-neutral-500 dark:text-neutral-400">
          Failed to load data
        </div>
      </div>
    )
  }

  // Show only the last N days based on slider
  const data = allData.slice(-days)
  const minDays = 7
  const maxDays = Math.max(7, allData.length)

  // Calculate total hours for the period
  const totalHours = data.reduce((acc, curr) => acc + curr.hours, 0)
  const avgHours = data.length > 0 ? totalHours / data.length : 0

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex items-start justify-between gap-1 leading-none md:flex-row md:items-center">
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <span>Daily Coding Time</span>
            <ChartLine size="1em" weight="duotone" />
          </span>
          <span className="text-xs text-neutral-600/50 dark:text-neutral-400/50">
            showing {data.length} days in {selectedYear}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats - hidden on mobile, shown on md+ */}
          <div className="hidden gap-4 text-xs md:flex">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 dark:text-neutral-400">
                Total:
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {totalHours.toFixed(1)}h
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 dark:text-neutral-400">
                Avg:
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {avgHours.toFixed(1)}h/day
              </span>
            </div>
          </div>
          {/* Year Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              {selectedYear}
              <CaretDown
                size={12}
                weight="bold"
                className={`transition-transform ${showYearDropdown ? 'rotate-180' : ''}`}
              />
            </button>
            {showYearDropdown && (
              <div className="absolute right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                {AVAILABLE_YEARS.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year)
                      setShowYearDropdown(false)
                    }}
                    className={`block w-full px-3 py-1 text-left text-xs transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                      selectedYear === year
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Stats row - shown on mobile only */}
      <div className="flex gap-4 text-xs md:hidden">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 dark:text-neutral-400">Total:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {totalHours.toFixed(1)}h
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 dark:text-neutral-400">Avg:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {avgHours.toFixed(1)}h/day
          </span>
        </div>
      </div>
      <div className="flex h-full items-center">
        <DailyChart data={data} />
      </div>
      {allData.length > 7 && (
        <div className="mt-2 w-full">
          <Slider.Root
            className="relative flex w-full touch-none select-none items-center"
            min={minDays}
            max={maxDays}
            step={1}
            value={[days]}
            onValueChange={([val]) => setDays(val)}
            aria-label="Days Range"
          >
            <Slider.Track className="relative h-1.5 flex-grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-blue-500 bg-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-blue-400 dark:bg-neutral-900" />
          </Slider.Root>
          <span className="mt-1.5 block text-center text-xs text-neutral-500 dark:text-neutral-400">
            Showing last {days} days of {selectedYear}
          </span>
        </div>
      )}
    </div>
  )
}
