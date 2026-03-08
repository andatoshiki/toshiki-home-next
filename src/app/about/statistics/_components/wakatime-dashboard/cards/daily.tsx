'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line
} from 'recharts'
import { getWakatimeData } from '~/lib/api/wakatime'
import { formatSeconds } from '../utils/formatSeconds'
import * as Slider from '@radix-ui/react-slider'
import { DailySkeleton } from '~/app/about/statistics/_components/wakatime-dashboard/skeleton/daily-skeleton'

// Process summaries into a shape Recharts can consume
function processDailyData(summaries: any[]) {
  return summaries.map((summary: any) => {
    const date = summary.range?.date || ''
    const totalSeconds = summary.grand_total?.total_seconds || 0
    const projects = Array.isArray(summary.projects)
      ? summary.projects.map((p: any) => ({
          name: p.name,
          seconds: p.total_seconds || 0,
          text: p.text || formatSeconds(p.total_seconds || 0)
        }))
      : []

    const projectFields: Record<string, number> = {}
    projects.forEach(p => {
      projectFields[p.name] = p.seconds
    })

    return {
      date,
      totalSeconds,
      totalText: formatSeconds(totalSeconds),
      ...projectFields,
      projects
    }
  })
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const day = payload[0].payload
    return (
      <div className="rounded-xl bg-neutral-900/90 p-4 text-neutral-100 shadow-xl dark:bg-neutral-800/90">
        <div className="mb-2 text-lg font-bold">{label}</div>
        <div className="mb-2">
          <span className="font-semibold">Total:</span> {day.totalText}
        </div>
        {day.projects?.length > 0 && (
          <div>
            {day.projects.map((proj: any) => (
              <div key={proj.name} className="mb-1 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-neutral-400" />
                <span className="font-medium">{proj.name}</span>
                <span className="ml-auto text-xs text-neutral-300">
                  {proj.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  return null
}

export function WakatimeDailyBarChart() {
  const [allData, setAllData] = useState<any[]>([])
  const [days, setDays] = useState(30)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetchData() {
      try {
        const wakatime = await getWakatimeData()
        const dailyData = processDailyData(wakatime.summaries || [])
        if (mounted) setAllData(dailyData)
      } catch (e) {
        console.error('failed to load wakatime', e)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    fetchData()
    return () => {
      mounted = false
    }
  }, [])
  if (isLoading) {
    return <DailySkeleton />
  }

  // Show only the last N days
  const data = allData.slice(-days)
  const minDays = Math.min(7, allData.length || 7)
  const maxDays = Math.max(7, Math.min(90, allData.length || 90))

  // Collect all unique project names for stacked bars
  const projectNames = Array.from(
    new Set(
      data.flatMap((day: any) => (day.projects || []).map((p: any) => p.name))
    )
  )

  const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#a28bfe',
    '#ff6699',
    '#b6e880',
    '#6b5b95',
    '#ffbb28',
    '#ffb347',
    '#ff6f61',
    '#00C49F',
    '#0088FE',
    '#FFB347',
    '#B6E880'
  ]

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
        <span>Daily Coding Time (Last {days} Days)</span>
      </span>

      <div className="flex h-full w-full items-center justify-center">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v: any) => formatSeconds(v, false)} />
            <Tooltip content={<CustomTooltip />} />

            {projectNames.map((name, idx) => (
              <Bar
                key={name}
                dataKey={name}
                stackId="a"
                fill={COLORS[idx % COLORS.length]}
                radius={
                  idx === projectNames.length - 1 ? [4, 4, 0, 0] : undefined
                }
                barSize={20}
              />
            ))}

            {/* Trendline overlay for total coding time */}
            <Line
              type="monotone"
              dataKey="totalSeconds"
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
              name="Trend"
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {allData.length > 0 && (
        <div className="mt-4 w-full">
          <Slider.Root
            className="relative flex w-full touch-none select-none items-center"
            min={minDays}
            max={maxDays}
            step={1}
            value={[days]}
            onValueChange={([val]) => setDays(val)}
            aria-label="Days Range"
          >
            <Slider.Track className="relative h-2 flex-grow rounded-full bg-neutral-300 dark:bg-neutral-800">
              <Slider.Range className="absolute h-2 rounded-full bg-neutral-600 dark:bg-neutral-400" />
            </Slider.Track>
            <Slider.Thumb className="block h-5 w-5 rounded-full border border-neutral-400 bg-neutral-900 shadow focus:outline-none dark:bg-neutral-200" />
          </Slider.Root>
          <span className="mt-2 block text-center text-xs text-neutral-500">
            Days Shown: {days}
          </span>
        </div>
      )}
    </div>
  )
}
