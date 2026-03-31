'use client'

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '~/components/ui/chart'
import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
import type {
  GithubActivitySource,
  GithubActivitySeriesDay
} from '~/lib/api/github/activity'
import { githubActivitySourceDefinitions } from '~/lib/api/github/activity'

const chartConfig = githubActivitySourceDefinitions.reduce((config, source) => {
  config[source.type] = {
    label: source.label,
    theme: source.theme
  }

  return config
}, {} as ChartConfig)

export function Chart({
  data,
  sources
}: {
  data: GithubActivitySeriesDay[]
  sources: readonly GithubActivitySource[]
}) {
  const isDarkMode = useAbsoluteTheme() === 'dark'

  return (
    <ChartContainer
      config={chartConfig}
      className="!aspect-auto h-[280px] w-full"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 12, left: 8, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="2 3"
          stroke={isDarkMode ? '#ffffff20' : '#00000020'}
        />
        <XAxis
          dataKey="shortDate"
          minTickGap={18}
          tickMargin={8}
          tick={{
            strokeWidth: 0.5,
            fontSize: '0.72rem',
            fill: isDarkMode ? '#a3a3a3' : '#525252'
          }}
          axisLine={false}
          tickLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_label, payload) => {
                const point = payload?.[0]?.payload as
                  | { date?: string }
                  | undefined

                if (!point?.date) {
                  return ''
                }

                return new Date(`${point.date}T12:00:00`).toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }
                )
              }}
            />
          }
        />
        {sources.map(source => (
          <Line
            key={source.type}
            dataKey={source.type}
            type="linear"
            stroke={`var(--color-${source.type})`}
            strokeWidth={source.strokeWidth}
            strokeDasharray={
              'strokeDasharray' in source ? source.strokeDasharray : undefined
            }
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}
