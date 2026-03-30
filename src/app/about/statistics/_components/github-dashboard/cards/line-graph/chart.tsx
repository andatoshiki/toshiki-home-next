'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  XAxis
} from 'recharts'
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent'

import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
import { GithubContributionActivityDay } from '~/lib/api/github'

export function Chart({ data }: { data: GithubContributionActivityDay[] }) {
  const isDarkMode = useAbsoluteTheme() === 'dark'
  const strokeColor = isDarkMode ? '#f5f5f5' : '#171717'
  const gradientColor = isDarkMode ? '#f5f5f5' : '#171717'

  return (
    <AreaChart
      width={900}
      height={220}
      data={data}
      className="cursor-pointer"
      margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={gradientColor} stopOpacity={0.35} />
          <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis
        dataKey="shortDate"
        interval={0}
        tick={{ strokeWidth: 0.5, fontSize: '0.8rem' }}
      />
      <CartesianGrid
        strokeDasharray="2 3"
        stroke={isDarkMode ? '#ffffff20' : '#00000030'}
      />
      <Tooltip cursor={false} content={<ContributionsToolTip />} />
      <Area
        dot={false}
        activeDot={false}
        strokeWidth={3}
        type="linear"
        dataKey="contributionCount"
        aria-label="count"
        stroke={strokeColor}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </AreaChart>
  )
}

const ContributionsToolTip = ({
  active,
  payload
}: TooltipProps<ValueType, NameType>) => {
  const day = payload?.[0]?.payload as GithubContributionActivityDay | undefined

  if (active && day && day.contributionCount > 0) {
    return (
      <div className="w-fit max-w-[250px] rounded-md bg-neutral-100 p-5 text-sm text-black shadow-lg dark:bg-neutral-950 dark:text-gray-200">
        <p className="label">
          <span className="font-medium">Date :</span>{' '}
          {new Date(`${day.date}T12:00:00`).toDateString()}
        </p>
        <p className="desc">
          <span className="font-medium">Contributions :</span>{' '}
          {day.contributionCount}
        </p>
      </div>
    )
  }

  return null
}
