'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps
} from 'recharts'
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent'

import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
import { formatTime } from '../utils/format-time'

interface LanguageData {
  name: string
  value: number
}

interface LanguagesChartProps {
  data: LanguageData[]
  limit?: number
}

// Modern accent colors that work well in both light and dark mode
const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
  '#a855f7', // purple-500
  '#f43f5e', // rose-500
  '#22c55e', // green-500
  '#eab308' // yellow-500
]

export function LanguagesChart({ data, limit = 8 }: LanguagesChartProps) {
  const isDarkMode = useAbsoluteTheme() === 'dark'

  // Take top N languages, combine rest into "Other"
  const processedData = (() => {
    if (data.length <= limit) return data
    const topN = data.slice(0, limit - 1)
    const otherTotal = data
      .slice(limit - 1)
      .reduce((acc, curr) => acc + curr.value, 0)
    return [...topN, { name: 'Other', value: otherTotal }]
  })()

  const total = processedData.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {processedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              className="transition-opacity hover:opacity-80"
            />
          ))}
        </Pie>
        <Tooltip content={<LanguageTooltip total={total} />} />
        {/* Center text showing total */}
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isDarkMode ? '#f5f5f5' : '#262626'}
          fontSize="18"
          fontWeight="bold"
        >
          {formatTime(total)}
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isDarkMode ? '#a3a3a3' : '#737373'}
          fontSize="12"
        >
          total
        </text>
      </PieChart>
    </ResponsiveContainer>
  )
}

interface LanguageTooltipProps extends TooltipProps<ValueType, NameType> {
  total: number
}

const LanguageTooltip = ({ active, payload, total }: LanguageTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as LanguageData
    const percentage = ((data.value / total) * 100).toFixed(1)

    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <span className="font-medium text-neutral-800 dark:text-neutral-100">
            {data.name}
          </span>
        </div>
        <div className="mt-1 text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold">{formatTime(data.value)}</span>
          <span className="ml-1 text-neutral-400 dark:text-neutral-500">
            ({percentage}%)
          </span>
        </div>
      </div>
    )
  }

  return null
}
