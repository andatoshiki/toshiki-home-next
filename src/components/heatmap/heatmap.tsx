'use client'
import { useEffect, useState } from 'react'
import React from 'react'
import HeatMap from '@uiw/react-heat-map'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { Calendar, Terminal, ArrowUpRight } from '@phosphor-icons/react'

function formatDate(date: string | Date) {
  let d: Date
  if (typeof date === 'string') {
    d = new Date(date.replace(/-/g, '/'))
  } else {
    d = date
  }
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}`
}
export function BlogHeatmap({
  posts,
  width = 600,
  loading
}: {
  posts?: Array<{ date: string; title: string }>
  width?: number
  loading?: boolean
}) {
  // Set dark mode CSS variables for labels and grid
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.style.setProperty(
        '--heatmap-label-color',
        isDark ? '#8B949E' : '#222'
      )
      document.documentElement.style.setProperty(
        '--heatmap-month-label-color',
        isDark ? '#8B949E' : '#222'
      )
      document.documentElement.style.setProperty(
        '--heatmap-week-label-color',
        isDark ? '#8B949E' : '#222'
      )
      document.documentElement.style.setProperty(
        '--heatmap-bg',
        isDark ? '#161B22' : '#fff'
      )
    }
  }, [])

  const map = new Map<string, { count: number; title: string[] }>()
  if (posts) {
    for (const post of posts) {
      const date = formatDate(post.date)
      if (!map.has(date)) {
        map.set(date, { count: 1, title: [post.title] })
      } else {
        const entry = map.get(date)!
        entry.count++
        entry.title.push(post.title)
      }
    }
  }

  // Force the heatmap to always start from Jan 1 of the current year
  const now = new Date()
  const currentYearStart = new Date(now.getFullYear(), 0, 1)
  const currentYearEnd = new Date(now.getFullYear(), 11, 31)
  const start = currentYearStart
  // Extend end date to the first Saturday after Dec 31 to ensure December label shows
  let end = new Date(currentYearEnd)
  while (end.getDay() !== 6) {
    // 6 = Saturday
    end.setDate(end.getDate() + 1)
  }

  // Fill all days in range with count 0 if missing
  const allDays: Array<{ date: string; count: number; title: string }> = []
  for (
    let d = new Date(start.getTime());
    d <= end;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  ) {
    const dateStr = formatDate(d)
    const entry = map.get(dateStr)
    if (entry && typeof entry.count === 'number' && entry.count > 0) {
      allDays.push({
        date: dateStr,
        count: entry.count,
        title: entry.title.join(', ')
      })
    } else {
      allDays.push({ date: dateStr, count: 0, title: '' })
    }
  }

  // Calculate max count for dynamic color scaling
  const maxCount = allDays.reduce((max, v) => Math.max(max, v.count), 0)
  const colorScale = [
    '#E0E0E0',
    '#E0E0E0',
    '#C6E48B',
    '#7BC96F',
    '#239A3B',
    '#196127'
  ] // 0/1: grey, 2: light green, 3: medium green, 4: dark green, 5+: darkest
  const panelColors: Record<number, string> = {}
  for (let i = 0; i <= maxCount; i++) {
    if (i === 0) {
      panelColors[i] = colorScale[0]
    } else if (i === 1) {
      panelColors[i] = colorScale[1]
    } else if (i === 2) {
      panelColors[i] = colorScale[2]
    } else if (i === 3) {
      panelColors[i] = colorScale[3]
    } else {
      panelColors[i] = colorScale[4]
    }
  }

  function getTooltipContent(value: any) {
    return (
      <ul className="m-0 list-none pl-0">
        <li className="flex items-center gap-1 text-[15px]">
          <Calendar className="mr-1 inline-block align-middle text-[15px]" />
          <span className="align-middle text-[15px]">{value.date}</span>
        </li>
        {value.count > 0 ? (
          value.title.split(', ').map((title: string, idx: number) => {
            const post = posts?.find(p => p.title === title)
            const href = post
              ? // ? `/blog/post/${encodeURIComponent(post.title.replace(/\s+/g, '-').toLowerCase())}`
                `/blog/til`
              : '#'
            return (
              <li key={idx} className="flex items-center gap-1 text-[15px]">
                <Terminal className="mr-1 inline-block align-middle text-[15px]" />
                <a
                  href={href}
                  className="inline-flex items-center rounded-md px-1 align-middle text-[15px] font-medium text-white transition hover:bg-neutral-200/30 hover:text-white dark:text-white dark:hover:bg-neutral-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{title}</span>
                  <ArrowUpRight size="1em" className="ml-1 text-xs" />
                </a>
              </li>
            )
          })
        ) : (
          <li className="flex items-center gap-1 text-[15px]">
            <Terminal className="mr-1 inline-block align-middle text-[15px]" />
            <span className="align-middle text-[15px]">No posts</span>
          </li>
        )}
      </ul>
    )
  }

  // Week labels and dynamic height calculation
  const weekLabels = ['M', '', 'W', '', 'F', '', '']
  const numRows = weekLabels.filter(label => label).length
  const rectSize = 14
  const space = 2
  // Calculate number of weeks in the range for dynamic minWidth
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const daysDiff =
    Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1
  const numberOfWeeks = Math.ceil(daysDiff / 7)
  const minWidth = numberOfWeeks * (rectSize + space) + 50 // +110 for extra 50px buffer
  // Add extra buffer to height to prevent SVG cutoff
  const heatmapHeight = numRows * (rectSize + space) + 40

  return (
    <div className="m-0 flex w-full flex-col justify-center overflow-visible overflow-x-auto rounded-xl border border-black/10 bg-white/70 pb-0 pl-2 pr-2 pt-2 shadow dark:border-white/10 dark:bg-neutral-900/70 md:overflow-x-auto">
      {/* Dark mode SVG overrides for labels and grid */}
      <style>{`
      .w-heatmap {
        min-height: ${heatmapHeight}px;
        height: auto;
        font-weight: bold;
      }
      [data-rmiz-modal-overlay='visible'] {
        background: rgba(24, 24, 27, 0.7) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        transition: background 0.3s, backdrop-filter 0.3s;
      }
      .w-heatmap rect[fill='#E0E0E0'] {
        fill: #E0E0E0;
      }
      html.dark .w-heatmap rect[fill='#E0E0E0'],
      body.dark .w-heatmap rect[fill='#E0E0E0'] {
        fill: #161B22 !important;
      }
      html.dark .w-heatmap text,
      body.dark .w-heatmap text {
        color: #c9d1d9;
      }
        @media (min-width: 768px) and (max-width: 1023.98px) {
      .w-heatmap-week {
        overflow-x: auto;
        /* Optional: show scrollbar always */
        scrollbar-width: thin;
        scrollbar-color: #a3a3a3 #e5e5e5;
      }
      @media (min-width: 1024px) {
        .w-heatmap-week {
          overflow-x: visible;
      }
      `}</style>
      <RadixTooltip.Provider delayDuration={100} skipDelayDuration={0}>
        <div
          className="w-heatmap-week w-full overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 md:min-w-0 md:overflow-x-hidden lg:overflow-x-visible"
          style={{ minWidth, width: '100%' }}
        >
          <HeatMap
            value={allDays}
            className={
              typeof window !== 'undefined' &&
              window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'heatmap-dark'
                : ''
            }
            style={{
              display: 'block',
              margin: 0,
              padding: 0,
              width: '100%',
              fontFamily: 'inherit',
              color: 'var(--heatmap-label-color, #222)'
            }}
            startDate={start}
            endDate={end}
            legendCellSize={0.01}
            rectSize={rectSize}
            space={space}
            weekLabels={weekLabels}
            rectProps={{ rx: 4 }}
            rectRender={(props, value) => (
              <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>
                  <rect
                    {...props}
                    style={{
                      cursor: value.count > 0 ? 'pointer' : 'default',
                      borderRadius: 4
                    }}
                  />
                </RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                  <RadixTooltip.Content
                    side="top"
                    sideOffset={4}
                    className="menu-tooltip-content whitespace-pre-line text-white"
                  >
                    {getTooltipContent(value)}
                    <RadixTooltip.Arrow className="menu-tooltip-arrow" />
                  </RadixTooltip.Content>
                </RadixTooltip.Portal>
              </RadixTooltip.Root>
            )}
            panelColors={colorScale}
          />
          {/* Legend (commented out) */}
          {false && (
            <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>Less</span>
              {colorScale.map((color, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 12,
                    background: color,
                    borderRadius: 3,
                    border: '1px solid #ccc',
                    marginLeft: 2,
                    marginRight: 2
                  }}
                />
              ))}
              <span>More</span>
            </div>
          )}
        </div>
      </RadixTooltip.Provider>
    </div>
  )
}
