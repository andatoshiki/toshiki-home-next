'use client'

import { Treemap, Tooltip, ResponsiveContainer } from 'recharts'
import { getWakatimeData } from '~/lib/api/wakatime'
import { useEffect, useState } from 'react'
import { ProjectsSkeleton } from '~/app/about/statistics/_components/wakatime-dashboard/skeleton/projects-skeleton'

const COLORS = [
  '#6495ED',
  '#40E0D0',
  '#B0E0E6',
  '#778899',
  '#FFD700',
  '#FFB347',
  '#B6E880',
  '#FF6F61',
  '#6B5B95',
  '#A28BFE'
]

function aggregateProjectTotals(summaries: any[], days: number) {
  const cutoff = summaries.slice(-days)
  const totals: Record<string, number> = {}
  cutoff.forEach((summary: any) => {
    if (Array.isArray(summary.projects)) {
      summary.projects.forEach((proj: any) => {
        if (!totals[proj.name]) totals[proj.name] = 0
        totals[proj.name] += proj.total_seconds
      })
    }
  })
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function WakatimeProjectsTreemap() {
  const [data, setData] = useState<any[]>([])
  const [days] = useState(7)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const wakatime = await getWakatimeData()
      setData(aggregateProjectTotals(wakatime.summaries, days))
      setIsLoading(false)
    }
    fetchData()
  }, [days])

  if (isLoading) {
    return <ProjectsSkeleton />
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600">
        <span>Projects (Last 7 Days)</span>
      </span>
      <div className="flex h-full w-full items-center justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <Treemap
            data={data}
            dataKey="value"
            nameKey="name"
            stroke="#fff"
            fill="#8884d8"
            aspectRatio={4 / 3}
            content={<CustomContent colors={COLORS} />}
          >
            <Tooltip
              formatter={(value: number, name: string) =>
                `${Math.round(Number(value) / 60)} min`
              }
              labelFormatter={() => ''}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CustomContent(props: any) {
  const { x, y, width, height, index, name, value, colors } = props
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ fill: colors[index % colors.length], stroke: '#fff' }}
      />
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={16}
        >
          {name}
        </text>
      )}
    </g>
  )
}
