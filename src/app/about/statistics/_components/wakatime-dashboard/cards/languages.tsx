'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getWakatimeData } from '~/lib/api/wakatime'
import { useEffect, useState } from 'react'
import { LanguagesSkeleton } from '~/app/about/statistics/_components/wakatime-dashboard/skeleton/languages-skeleton'

// Utility: detect if device is mobile (simple window.matchMedia check)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia('(max-width: 640px)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#A28BFE',
  '#FF6699',
  '#FFB347',
  '#B6E880',
  '#FF6F61',
  '#6B5B95'
]

export function WakatimeLanguagesChart() {
  const [data, setData] = useState<any[]>([])
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const wakatime = await getWakatimeData()
      // Aggregate language totals
      const languageTotals: Record<string, number> = {}
      wakatime.summaries.forEach((summary: any) => {
        if (Array.isArray(summary.languages)) {
          summary.languages.forEach((lang: any) => {
            if (!languageTotals[lang.name]) languageTotals[lang.name] = 0
            languageTotals[lang.name] += lang.total_seconds
          })
        }
      })
      // Convert to array for recharts, sort by value descending for label logic
      const chartData = Object.entries(languageTotals).map(([name, value]) => ({
        name,
        value: Math.round(value / 60)
      }))
      // Find top 5 for label logic
      const top5 = chartData
        .slice()
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map(l => l.name)

      setData(chartData.map(d => ({ ...d, showLabel: top5.includes(d.name) })))
      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <LanguagesSkeleton />
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600">
        <span>Languages</span>
      </span>
      <div className="flex h-full w-full items-center justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              labelLine={false}
              label={
                isMobile ? false : props => (props.showLabel ? props.name : '')
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value} min`}
              labelFormatter={() => ''}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
