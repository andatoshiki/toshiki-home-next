'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  Cell
} from 'recharts'
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent'

import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
import { formatTime } from '../utils/format-time'

interface EditorData {
  name: string
  value: number
}

interface EditorsChartProps {
  data: EditorData[]
  limit?: number
}

// Complementary colors for editors
const COLORS = [
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4' // cyan-500
]

export function EditorsChart({ data, limit = 5 }: EditorsChartProps) {
  const isDarkMode = useAbsoluteTheme() === 'dark'

  // Take top N editors based on limit
  const processedData = data.slice(0, limit)
  const total = processedData.reduce((acc, curr) => acc + curr.value, 0)

  // Transform data and add colors
  const chartData = processedData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
    percentage: Math.round((item.value / total) * 100),
    // Convert seconds to hours for display
    hours: Math.round((item.value / 3600) * 10) / 10
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <XAxis type="number" hide domain={[0, 'dataMax']} />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={70}
          tick={{
            fontSize: 12,
            fill: isDarkMode ? '#a3a3a3' : '#525252'
          }}
        />
        <Tooltip
          content={<EditorTooltip />}
          cursor={{ fill: isDarkMode ? '#ffffff08' : '#00000008' }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

const EditorTooltip = ({
  active,
  payload
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EditorData & {
      fill: string
      percentage: number
      hours: number
    }

    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: data.fill }}
          />
          <span className="font-medium text-neutral-800 dark:text-neutral-100">
            {data.name}
          </span>
        </div>
        <div className="mt-1 text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold">{formatTime(data.value)}</span>
          <span className="ml-1 text-neutral-400 dark:text-neutral-500">
            ({data.percentage}%)
          </span>
        </div>
      </div>
    )
  }

  return null
}
