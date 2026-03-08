'use client'

import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
// @ts-ignore
import CalHeatmap from 'cal-heatmap'
// @ts-ignore
import Tooltip from 'cal-heatmap/plugins/Tooltip'
// @ts-ignore
import Legend from 'cal-heatmap/plugins/Legend'
import 'cal-heatmap/cal-heatmap.css'

export default function GithubHeatmap() {
  const calRef = useRef<HTMLDivElement>(null)
  const legendRef = useRef<HTMLDivElement>(null)
  const [days, setDays] = useState<any[]>([])
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    async function fetchData() {
      const startDate = `${currentYear}-01-01`
      const endDate = `${currentYear}-12-31`
      const res = await fetch(`/api/github?start=${startDate}&end=${endDate}`)
      const json = await res.json()
      setDays(json.data || [])
    }
    fetchData()
  }, [currentYear])

  const calInstance = useRef<any>(null)
  useEffect(() => {
    if (!calRef.current || days.length === 0) return
    const getDate = (day: any) => day.date
    const start = dayjs(`${currentYear}-01-01`)
    const end = dayjs(`${currentYear}-12-31`)
    const dateMap = new Map(
      days.map(day => [
        getDate(day),
        Math.round((day.grand_total?.total_seconds || 0) / 60)
      ])
    )
    const data: { date: string; value: number }[] = []
    for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, 'day')) {
      const dateStr = d.format('YYYY-MM-DD')
      data.push({
        date: dateStr,
        value: dateMap.get(dateStr) || 0
      })
    }
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
          start: new Date(currentYear, 0, 1),
          min: data[0]?.date,
          max: data[data.length - 1]?.date,
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
            scheme: 'Greens',
            domain: [0, 240],
            type: 'quantize'
          }
        }
      },
      [
        [
          Tooltip,
          {
            text: (_timestamp: number, value: number, dayjsDate: any) => {
              const date = dayjsDate.format('YYYY-MM-DD')
              return `<div><div>${date} | ${value} contributions</div></div>`
            }
          }
        ],
        [
          Legend,
          {
            itemSelector: legendRef.current,
            label: '每日贡献次数'
          }
        ]
      ]
    )
    calInstance.current = cal
    return () => cal.destroy()
  }, [days, currentYear])

  return (
    <div className="flex flex-col justify-center">
      <div
        className="w-full overflow-x-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div ref={calRef}></div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between">
        <span className="mx-2 select-none font-semibold">{currentYear}</span>
        <div ref={legendRef} className="flex justify-end"></div>
      </div>
      {days.length === 0 && (
        <div className="mt-4 text-center text-neutral-500">
          No contributions for {currentYear}.
        </div>
      )}
    </div>
  )
}
