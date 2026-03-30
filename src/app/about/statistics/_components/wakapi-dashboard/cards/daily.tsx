'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChartLine } from '@phosphor-icons/react/dist/ssr'
import * as Slider from '@radix-ui/react-slider'
import {
  getDailyCodingData,
  getAvailableWakapiYears,
  getCurrentWakapiYear
} from '~/lib/api/wakapi'
import { DailyChart } from '../charts/daily-chart'
import { DailySkeleton } from '../skeleton/daily-skeleton'
import { DropdownSelect } from '../components/dropdown-select'
import { useWakapiYearSummaries } from '../data/provider'

export function WakapiDaily() {
  const [selectedYear, setSelectedYear] = useState(getCurrentWakapiYear())
  const [days, setDays] = useState(30)
  const {
    data: summaries,
    error,
    isLoading
  } = useWakapiYearSummaries(selectedYear)
  const allData = useMemo(() => getDailyCodingData(summaries), [summaries])
  const yearOptions = useMemo(
    () =>
      getAvailableWakapiYears().map(year => ({
        value: year,
        label: String(year)
      })),
    []
  )

  useEffect(() => {
    if (allData.length === 0) {
      return
    }

    setDays(allData.length)
  }, [allData.length, selectedYear])

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
            showing full available range for {selectedYear}
          </span>
        </div>
        <div className="flex h-[220px] items-center justify-center text-neutral-500 dark:text-neutral-400">
          Failed to load data
        </div>
      </div>
    )
  }

  // Show the first N available days of the selected year.
  const data = allData.slice(0, days)
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
            showing first {data.length} days of {selectedYear}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats - hidden on mobile, shown on md+ */}
          <div className="hidden gap-4 text-xs md:flex">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 dark:text-neutral-400">
                Total:
              </span>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                {totalHours.toFixed(1)}h
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 dark:text-neutral-400">
                Avg:
              </span>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                {avgHours.toFixed(1)}h/day
              </span>
            </div>
          </div>
          {/* Year Dropdown */}
          <div className="relative">
            <DropdownSelect
              value={selectedYear}
              options={yearOptions}
              onChange={setSelectedYear}
            />
          </div>
        </div>
      </div>
      {/* Stats row - shown on mobile only */}
      <div className="flex gap-4 text-xs md:hidden">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 dark:text-neutral-400">Total:</span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">
            {totalHours.toFixed(1)}h
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 dark:text-neutral-400">Avg:</span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">
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
              <Slider.Range className="absolute h-1.5 rounded-full bg-neutral-700 dark:bg-neutral-300" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-neutral-700 bg-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-700/20 dark:border-neutral-300 dark:bg-neutral-900 dark:focus:ring-neutral-300/20" />
          </Slider.Root>
          <span className="mt-1.5 block text-center text-xs text-neutral-500 dark:text-neutral-400">
            Showing first {days} days of {selectedYear}
          </span>
        </div>
      )}
    </div>
  )
}
