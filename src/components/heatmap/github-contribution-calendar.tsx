'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '~/lib/utils'
import type { GithubContributionCalendarDay } from '~/lib/api/github'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'

type HeatmapCell = {
  date: Date
  key: string
  count: number
  level: number
  label: string
  disabled: boolean
}

const levelClassNames = [
  'bg-neutral-200 dark:bg-neutral-900',
  'bg-neutral-300 dark:bg-neutral-800',
  'bg-neutral-400 dark:bg-neutral-700',
  'bg-neutral-600 dark:bg-neutral-500',
  'bg-neutral-800 dark:bg-neutral-200'
]

const weekdayIndices = [1, 3, 5]

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

export function GithubContributionCalendar({
  data,
  className,
  cellSize = 12,
  cellGap = 3,
  weekStartsOn = 1
}: {
  data: GithubContributionCalendarDay[]
  className?: string
  cellSize?: number
  cellGap?: number
  weekStartsOn?: 0 | 1
}) {
  const [availableWidth, setAvailableWidth] = useState(0)
  const heatmapViewportRef = useRef<HTMLDivElement>(null)

  const sortedData = useMemo(
    () => [...data].sort((left, right) => left.date.localeCompare(right.date)),
    [data]
  )

  const valueMap = useMemo(() => {
    const map = new Map<string, GithubContributionCalendarDay>()

    sortedData.forEach(item => {
      map.set(item.date.slice(0, 10), item)
    })

    return map
  }, [sortedData])

  const firstContributionDate = useMemo(() => {
    const firstDate = sortedData[0]?.date

    return firstDate
      ? startOfDay(new Date(`${firstDate}T12:00:00`))
      : startOfDay(new Date())
  }, [sortedData])

  const lastContributionDate = useMemo(() => {
    const lastDate = sortedData[sortedData.length - 1]?.date

    return lastDate
      ? startOfDay(new Date(`${lastDate}T12:00:00`))
      : startOfDay(new Date())
  }, [sortedData])

  const start = useMemo(
    () => startOfWeek(firstContributionDate, weekStartsOn),
    [firstContributionDate, weekStartsOn]
  )
  const end = useMemo(() => lastContributionDate, [lastContributionDate])

  const weeks = useMemo(() => {
    const msInDay = 24 * 60 * 60 * 1000
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / msInDay) + 1
    return Math.ceil(totalDays / 7)
  }, [end, start])

  const columns = useMemo(() => {
    const nextColumns: HeatmapCell[][] = []

    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
      const column: HeatmapCell[] = []

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const date = addDays(start, weekIndex * 7 + dayIndex)
        const inRange = date >= firstContributionDate && date <= end
        const key = toDateKey(date)
        const contribution = inRange ? valueMap.get(key) : undefined

        column.push({
          date,
          key,
          count: contribution?.count ?? 0,
          level: contribution?.level ?? 0,
          disabled: !inRange,
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
  }, [end, firstContributionDate, start, valueMap, weeks])

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

  const labelColumnWidth = 40
  const labelGap = 8
  const monthLabelHeight = 18
  const gridHeight = 7 * cellSize + 6 * cellGap
  const contentWidth = labelColumnWidth + labelGap + gridWidth
  const contentHeight = monthLabelHeight + gridHeight
  const heatmapScale =
    availableWidth > 0 ? Math.min(1, availableWidth / contentWidth) : 1
  const scaledContentWidth = Math.ceil(contentWidth * heatmapScale) + 2
  const scaledContentHeight = Math.ceil(contentHeight * heatmapScale) + 2

  useEffect(() => {
    const viewport = heatmapViewportRef.current

    if (!viewport) return

    const updateWidth = () => {
      setAvailableWidth(viewport.clientWidth)
    }

    updateWidth()

    const observer = new ResizeObserver(() => {
      updateWidth()
    })

    observer.observe(viewport)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          less
        </span>
        <div className="flex items-center" style={{ gap: `${cellGap}px` }}>
          {levelClassNames.map((levelClassName, index) => (
            <div
              key={index}
              className={cn('rounded-[3px]', levelClassName)}
              style={{ width: cellSize, height: cellSize }}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          more
        </span>
      </div>

      <TooltipProvider delayDuration={80}>
        <div ref={heatmapViewportRef} className="w-full overflow-hidden">
          <div
            style={{ width: scaledContentWidth, height: scaledContentHeight }}
          >
            <div
              style={{
                width: contentWidth,
                transform: `scale(${heatmapScale})`,
                transformOrigin: 'top left'
              }}
            >
              <div
                className="flex items-end"
                style={{ paddingLeft: labelColumnWidth + labelGap }}
              >
                <div
                  className="relative"
                  style={{
                    height: monthLabelHeight,
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
                  className="flex flex-col"
                  style={{
                    width: labelColumnWidth,
                    marginRight: labelGap,
                    gap: `${cellGap}px`
                  }}
                  aria-hidden="true"
                >
                  {Array.from({ length: 7 }).map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex items-center justify-end text-xs text-neutral-500 dark:text-neutral-400"
                      style={{ width: labelColumnWidth, height: cellSize }}
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
                  aria-label="GitHub contribution calendar"
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
                                  : `${cell.label}: ${cell.count} contributions`
                              }
                              role="gridcell"
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={6}>
                            {cell.count > 0
                              ? `${cell.count} contributions on ${cell.label}`
                              : `No contributions on ${cell.label}`}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}
