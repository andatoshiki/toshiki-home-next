'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '~/lib/utils'
import { getWakatimeHeatmapData } from '~/lib/api/wakatime-heatmap'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'

type HeatmapDatum = {
  date: string | Date
  value: number
  meta?: unknown
}

type HeatmapCell = {
  date: Date
  key: string
  value: number
  level: number
  label: string
  disabled: boolean
  meta?: unknown
}

interface WakatimeHeatmapShadcnProps {
  className?: string
  cellSize?: number
  cellGap?: number
  weekStartsOn?: 0 | 1
}

const levelClassNames = [
  'bg-neutral-200 dark:bg-neutral-800',
  'bg-emerald-200 dark:bg-emerald-900/60',
  'bg-emerald-300 dark:bg-emerald-800',
  'bg-emerald-500 dark:bg-emerald-600',
  'bg-emerald-600 dark:bg-emerald-500'
]

const weekdayIndices = [1, 3, 5]
const currentYear = new Date().getFullYear()

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toDateKey(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function startOfWeek(date: Date, weekStartsOn: 0 | 1) {
  const next = startOfDay(date)
  const day = next.getDay()
  const diff = (day - weekStartsOn + 7) % 7
  next.setDate(next.getDate() - diff)
  return next
}

function getHourLevel(value: number) {
  if (value <= 0) return 0
  if (value <= 0.5) return 1
  if (value <= 1.5) return 2
  if (value <= 3) return 3
  return 4
}

function clampLevel(level: number, levelCount: number) {
  return Math.max(0, Math.min(levelCount - 1, level))
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function formatMonth(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'short' })
}

function weekdayLabelForIndex(index: number, weekStartsOn: 0 | 1) {
  const actualDay = (weekStartsOn + index) % 7
  const base = new Date(Date.UTC(2024, 0, 7 + actualDay))
  return base.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()
}

export default function WakatimeHeatmapShadcn({
  className,
  cellSize = 12,
  cellGap = 3,
  weekStartsOn = 1
}: WakatimeHeatmapShadcnProps) {
  const [year, setYear] = useState(currentYear)
  const [data, setData] = useState<HeatmapDatum[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    getWakatimeHeatmapData(year)
      .then(res => {
        if (cancelled) return
        setData(
          res.map(item => ({
            date: item.date,
            value: item.value
          }))
        )
      })
      .catch(() => {
        if (cancelled) return
        setError('Failed to load WakaTime heatmap')
        setData([])
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [year])

  const valueMap = useMemo(() => {
    const map = new Map<string, { value: number; meta?: unknown }>()

    for (const item of data) {
      let key = ''

      if (typeof item.date === 'string') {
        key = item.date.slice(0, 10)
      } else {
        key = toDateKey(item.date)
      }

      if (!key) continue

      const previous = map.get(key)
      map.set(key, {
        value: (previous?.value ?? 0) + Math.max(0, item.value ?? 0),
        meta: item.meta ?? previous?.meta
      })
    }

    return map
  }, [data])

  const start = useMemo(() => new Date(year, 0, 1), [year])
  const end = useMemo(() => new Date(year, 11, 31), [year])
  const firstWeek = useMemo(
    () => startOfWeek(start, weekStartsOn),
    [start, weekStartsOn]
  )

  const weeks = useMemo(() => {
    const msInDay = 24 * 60 * 60 * 1000
    const totalDays =
      Math.ceil((end.getTime() - firstWeek.getTime()) / msInDay) + 1
    return Math.ceil(totalDays / 7)
  }, [end, firstWeek])

  const columns = useMemo(() => {
    const nextColumns: HeatmapCell[][] = []

    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
      const column: HeatmapCell[] = []

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const date = addDays(firstWeek, weekIndex * 7 + dayIndex)
        const inRange = date >= start && date <= end
        const key = toDateKey(date)
        const value = inRange ? valueMap.get(key)?.value ?? 0 : 0
        const level = inRange ? getHourLevel(value) : 0

        column.push({
          date,
          key,
          value,
          level: clampLevel(level, levelClassNames.length),
          disabled: !inRange,
          meta: inRange ? valueMap.get(key)?.meta : undefined,
          label: date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        })
      }

      nextColumns.push(column)
    }

    return nextColumns
  }, [end, firstWeek, start, valueMap, weeks])

  const monthLabels = useMemo(() => {
    const labels: { colIndex: number; text: string }[] = []
    let lastLabelledWeek = -999
    const minWeekSpacing = 3

    for (let index = 0; index < columns.length; index++) {
      const column = columns[index]
      const firstInColumn =
        column.find(cell => !cell.disabled)?.date ?? column[0].date

      const previousColumn = index > 0 ? columns[index - 1] : null
      const previousDate =
        previousColumn?.find(cell => !cell.disabled)?.date ??
        previousColumn?.[0]?.date

      const monthChanged =
        !previousDate || !sameMonth(firstInColumn, previousDate)

      if (monthChanged && index - lastLabelledWeek >= minWeekSpacing) {
        labels.push({ colIndex: index, text: formatMonth(firstInColumn) })
        lastLabelledWeek = index
      }
    }

    return labels
  }, [columns])

  const gridWidth = useMemo(
    () => columns.length * (cellSize + cellGap) - cellGap,
    [cellGap, cellSize, columns.length]
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
            onClick={() => setYear(prev => prev - 1)}
            aria-label="View previous year"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
            onClick={() => setYear(prev => Math.min(currentYear, prev + 1))}
            disabled={year >= currentYear}
            aria-label="View next year"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            {year}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              loading
            </span>
          )}
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            less
          </span>
          <div className="flex items-center" style={{ gap: `${cellGap}px` }}>
            {levelClassNames.map((className, index) => (
              <div
                key={index}
                className={cn('rounded-[3px]', className)}
                style={{ width: cellSize, height: cellSize }}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            more
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400" role="status">
          {error}
        </p>
      )}

      <TooltipProvider delayDuration={80}>
        <div className="w-full overflow-x-auto">
          <div className="min-w-fit">
            <div className="flex items-end pl-11">
              <div
                className="relative"
                style={{
                  height: 18,
                  width: gridWidth
                }}
              >
                {monthLabels.map(label => (
                  <div
                    key={`${label.colIndex}-${label.text}`}
                    className="absolute text-xs text-neutral-500 dark:text-neutral-400"
                    style={{
                      left: label.colIndex * (cellSize + cellGap),
                      top: 0
                    }}
                  >
                    {label.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex">
              <div
                className="mr-2 flex flex-col"
                style={{ gap: `${cellGap}px` }}
                aria-hidden="true"
              >
                {Array.from({ length: 7 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center justify-end text-xs text-neutral-500 dark:text-neutral-400"
                    style={{ width: 40, height: cellSize }}
                  >
                    {weekdayIndices.includes(rowIndex)
                      ? weekdayLabelForIndex(rowIndex, weekStartsOn)
                      : ''}
                  </div>
                ))}
              </div>

              <div
                className="flex"
                style={{ gap: `${cellGap}px` }}
                role="grid"
                aria-label="WakaTime heatmap"
              >
                {columns.map((column, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="flex flex-col"
                    style={{ gap: `${cellGap}px` }}
                    role="rowgroup"
                  >
                    {column.map(cell => (
                      <Tooltip key={`${cell.key}-${columnIndex}`}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            disabled={cell.disabled}
                            className={cn(
                              'rounded-[3px] outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                              levelClassNames[cell.level],
                              cell.disabled &&
                                'pointer-events-none cursor-default opacity-35'
                            )}
                            style={{
                              width: cellSize,
                              height: cellSize
                            }}
                            aria-label={
                              cell.disabled
                                ? 'Outside range'
                                : `${cell.label}: ${cell.value.toFixed(1)} hours`
                            }
                            role="gridcell"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={6}>
                          {cell.value.toFixed(1)} hrs on {cell.label}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}
