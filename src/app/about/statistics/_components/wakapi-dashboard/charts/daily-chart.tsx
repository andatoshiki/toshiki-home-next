'use client'

import { useId, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '~/components/ui/chart'
import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'

interface DailyData {
  date: string
  shortDate: string
  totalSeconds: number
  hours: number
  text: string
}

interface DailyChartProps {
  data: DailyData[]
}

const highlightConfig = {
  glowWidth: 180
}

const chartConfig = {
  hours: {
    label: 'Coding Time',
    theme: {
      light: '#171717',
      dark: '#f5f5f5'
    }
  }
} satisfies ChartConfig

export function DailyChart({ data }: DailyChartProps) {
  const [hoverX, setHoverX] = useState<number | null>(null)
  const isDarkMode = useAbsoluteTheme() === 'dark'
  const gradientId = useId().replace(/:/g, '')
  const maskGradientId = useId().replace(/:/g, '')
  const maskId = useId().replace(/:/g, '')

  const tickInterval = data.length > 14 ? Math.floor(data.length / 7) : 1
  const maxHours = Math.max(...data.map(d => d.hours), 1)
  const yAxisMax = Math.ceil(maxHours / 2) * 2

  return (
    <ChartContainer
      config={chartConfig}
      className="!aspect-auto h-[220px] w-full"
    >
      <AreaChart
        data={data}
        className="cursor-pointer"
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        onMouseMove={event => {
          setHoverX(typeof event?.chartX === 'number' ? event.chartX : null)
        }}
        onMouseLeave={() => setHoverX(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-hours)"
              stopOpacity={0.34}
            />
            <stop
              offset="55%"
              stopColor="var(--color-hours)"
              stopOpacity={0.14}
            />
            <stop offset="95%" stopColor="var(--color-hours)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={maskGradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          {hoverX !== null && (
            <mask id={maskId}>
              <rect
                x={hoverX - highlightConfig.glowWidth / 2}
                y={0}
                width={highlightConfig.glowWidth}
                height="100%"
                fill={`url(#${maskGradientId})`}
              />
            </mask>
          )}
        </defs>
        <XAxis
          dataKey="shortDate"
          interval={tickInterval}
          tickMargin={8}
          tick={{
            strokeWidth: 0.5,
            fontSize: '0.75rem',
            fill: isDarkMode ? '#a3a3a3' : '#525252'
          }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, yAxisMax]}
          tickFormatter={(value: number) => `${value}h`}
          tick={{
            fontSize: '0.75rem',
            fill: isDarkMode ? '#a3a3a3' : '#525252'
          }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <CartesianGrid
          vertical={false}
          strokeDasharray="2 3"
          stroke={isDarkMode ? '#ffffff20' : '#00000020'}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              hideIndicator
              indicator="dot"
              formatter={(value, _name, item) => {
                const point = item?.payload as DailyData | undefined

                if (!point) {
                  return null
                }

                return (
                  <div className="grid w-full gap-1.5">
                    <div className="font-medium text-foreground">
                      {new Date(`${point.date}T12:00:00`).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }
                      )}
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 leading-none">
                      <span className="text-muted-foreground">Hours coded</span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {Number(value).toLocaleString(undefined, {
                          maximumFractionDigits: 1
                        })}
                        <span className="ml-1">h</span>
                      </span>
                    </div>
                  </div>
                )
              }}
            />
          }
        />
        <Area
          activeDot={{
            r: 5,
            stroke: 'var(--color-hours)',
            strokeWidth: 2,
            fill: isDarkMode ? '#171717' : '#ffffff'
          }}
          strokeWidth={1.25}
          type="natural"
          dataKey="hours"
          aria-label="hours"
          stroke="var(--color-hours)"
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          mask={hoverX !== null ? `url(#${maskId})` : undefined}
        />
      </AreaChart>
    </ChartContainer>
  )
}
