'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from 'recharts'
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent'

import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
import { formatHours } from '../utils/format-time'

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

export function DailyChart({ data }: DailyChartProps) {
  const isDarkMode = useAbsoluteTheme() === 'dark'

  // Filter to show only entries with ticks based on data length
  const tickInterval = data.length > 14 ? Math.floor(data.length / 7) : 1

  // Calculate max hours for Y-axis domain
  const maxHours = Math.max(...data.map(d => d.hours), 1)
  const yAxisMax = Math.ceil(maxHours / 2) * 2 // Round up to nearest even number

  // Find peak indices (local maxima)
  const peakIndices = new Set<number>()
  for (let i = 1; i < data.length - 1; i++) {
    if (
      data[i].hours > data[i - 1].hours &&
      data[i].hours > data[i + 1].hours &&
      data[i].hours > 0
    ) {
      peakIndices.add(i)
    }
  }
  // Also mark global max
  const globalMaxIdx = data.reduce(
    (maxIdx, curr, idx, arr) => (curr.hours > arr[maxIdx].hours ? idx : maxIdx),
    0
  )
  if (data[globalMaxIdx]?.hours > 0) peakIndices.add(globalMaxIdx)

  // Custom dot renderer - only show dots on peaks
  const renderDot = (props: any) => {
    const { cx, cy, index } = props
    if (!peakIndices.has(index)) return null
    return (
      <circle
        key={`dot-${index}`}
        cx={cx}
        cy={cy}
        r={4}
        fill="#3b82f6"
        stroke={isDarkMode ? '#171717' : '#ffffff'}
        strokeWidth={2}
      />
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        className="cursor-pointer"
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorCoding" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="shortDate"
          interval={tickInterval}
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
          strokeDasharray="2 3"
          stroke={isDarkMode ? '#ffffff20' : '#00000020'}
        />
        <Tooltip content={<CodingTimeTooltip />} />
        <Area
          dot={renderDot}
          activeDot={{
            r: 5,
            stroke: '#3b82f6',
            strokeWidth: 2,
            fill: isDarkMode ? '#171717' : '#ffffff'
          }}
          strokeWidth={2}
          type="monotone"
          dataKey="hours"
          aria-label="hours"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorCoding)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const CodingTimeTooltip = ({
  active,
  payload
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DailyData
    // Always calculate display text from hours to avoid API data issues
    const displayTime =
      data.hours >= 1
        ? `${data.hours.toFixed(1)} hrs`
        : `${Math.round(data.hours * 60)} mins`

    return (
      <div className="w-fit max-w-[250px] rounded-lg border border-neutral-200 bg-white p-3 text-sm shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200">
        <p className="font-medium text-neutral-800 dark:text-neutral-100">
          {new Date(data.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
        <p className="mt-1 text-blue-600 dark:text-blue-400">
          <span className="font-semibold">{displayTime}</span>
        </p>
      </div>
    )
  }

  return null
}
