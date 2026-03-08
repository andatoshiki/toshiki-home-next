'use client'
import { useEffect, useRef, useState } from 'react'
import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
// @ts-ignore
import CalHeatmap from 'cal-heatmap'
// @ts-ignore
import Tooltip from 'cal-heatmap/plugins/Tooltip'
// @ts-ignore
import Legend from 'cal-heatmap/plugins/Legend'
import 'cal-heatmap/cal-heatmap.css'
import { getWakatimeHeatmapData } from '~/lib/api/wakatime-heatmap'

function getCurrentYear() {
  return new Date().getFullYear()
}

export default function WakatimeHeatmap() {
  const theme = useAbsoluteTheme()
  const calRef = useRef<HTMLDivElement>(null)
  const legendRef = useRef<HTMLDivElement>(null)
  const [year, setYear] = useState(getCurrentYear())
  const [data, setData] = useState<Array<{ date: string; value: number }>>([])
  const [loading, setLoading] = useState(false)

  // Fetch WakaTime data for the selected year
  useEffect(() => {
    setLoading(true)
    getWakatimeHeatmapData(year)
      .then(res => setData(res))
      .finally(() => setLoading(false))
  }, [year])

  // Only one cal-heatmap instance and effect
  const calInstance = useRef<any>(null)
  useEffect(() => {
    if (!calRef.current || data.length === 0) return
    const rawData: Record<string, { value: number }> = {}
    data.forEach(entry => {
      rawData[entry.date] = { value: entry.value }
    })
    const cal = new CalHeatmap()
    cal.paint(
      {
        itemSelector: calRef.current,
        domain: {
          type: 'month',
          label: { position: 'top', height: 25 }
        },
        subDomain: { type: 'day', width: 11.6, radius: 2 },
        date: {
          start: new Date(year, 0, 1),
          min: `${year}-01-01`,
          max: `${year}-12-31`,
          locale: {
            months: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_')
          },
          timezone: 'Etc/UTC'
        },
        data: {
          source: data,
          x: 'date',
          y: 'value',
          defaultValue: 0
        },
        verticalOrientation: false,
        scale: {
          color: {
            range:
              theme === 'dark'
                ? ['#161b22', '#0a2f1a', '#006d32', '#26a641', '#39d353']
                : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            domain: [0.1, 1, 2, 4, 8], // hours thresholds
            type: 'threshold'
          }
        }
      },
      [
        [
          Tooltip,
          {
            text: (_timestamp: number, value: number, dayjsDate: any) => {
              const date = dayjsDate.format('YYYY-MM-DD')
              return `<div><div>${date} | ${value} hrs</div></div>`
            }
          }
        ],
        [
          Legend,
          {
            itemSelector: legendRef.current,
            label: 'Daily Programming Hours'
          }
        ]
      ]
    )
    calInstance.current = cal
    return () => cal.destroy()
  }, [data, theme, year])

  return (
    <div className="flex flex-col justify-center">
      <div
        className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700"
        ref={calRef}
      ></div>
      <div className="mt-8 flex w-full items-center justify-between">
        <div className="flex gap-2">
          <a
            className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-base font-medium text-black transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
            href="#"
            onClick={e => {
              e.preventDefault()
              setYear(y => y - 1)
            }}
          >
            ←
          </a>
          <a
            className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-base font-medium text-black transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
            href="#"
            onClick={e => {
              e.preventDefault()
              setYear(y => y + 1)
            }}
          >
            →
          </a>
        </div>
        <div className="flex items-center gap-2 text-lg font-bold text-neutral-700 dark:text-neutral-200">
          {year}
        </div>
        <div ref={legendRef} className="flex justify-end pr-5"></div>
      </div>
    </div>
  )
}
