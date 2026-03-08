'use client'
import { useEffect, useRef, useState } from 'react'
// @ts-ignore
import CalHeatmap from 'cal-heatmap'
// @ts-ignore
import Tooltip from 'cal-heatmap/plugins/Tooltip'
// @ts-ignore
import Legend from 'cal-heatmap/plugins/Legend'
import 'cal-heatmap/cal-heatmap.css'

import { leetcode } from '#content'
import { getSortedPosts } from '~/lib/get-sorted-posts'

function getLeetcodePosts() {
  // Filter only published posts and map to { title, date }
  return getSortedPosts(
    leetcode.map(post => ({
      ...post,
      description: post.description ?? ''
    }))
  )
    .filter(post => post.status === 'published')
    .map(post => ({
      title: post.title,
      date: post.date
    }))
}

export default function LeetcodeHeatmap() {
  const calRef = useRef<HTMLDivElement>(null)
  const legendRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<Array<{ title: string; date: string }>>([])

  useEffect(() => {
    setPosts(getLeetcodePosts())
  }, [])

  // Only one cal-heatmap instance and effect
  const calInstance = useRef<any>(null)
  useEffect(() => {
    if (!calRef.current || posts.length === 0) return
    const data = posts.map(post => {
      const dateKey = new Date(post.date).toISOString().slice(0, 10)
      return {
        date: dateKey,
        value: 1,
        title: post.title
      }
    })
    const rawData: Record<string, { title: string[] }> = {}
    posts.forEach(post => {
      const dateKey = new Date(post.date).toISOString().slice(0, 10)
      if (!rawData[dateKey]) rawData[dateKey] = { title: [] }
      rawData[dateKey].title.push(post.title)
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
          start: new Date(new Date().getFullYear(), 0, 1),
          min: data[0].date,
          max: data[data.length - 1].date,
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
            domain: [0, 5],
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
              const titles = rawData[date]?.title || []
              let result = `<div><div>${date} | ${value}题</div>`
              for (const title of titles) {
                result += `<div>「${title}」</div>`
              }
              result += '</div>'
              return result
            }
          }
        ],
        [
          Legend,
          {
            itemSelector: legendRef.current,
            label: '每日刷题数量'
          }
        ]
      ]
    )
    calInstance.current = cal
    return () => cal.destroy()
  }, [posts])

  return (
    <div className="flex flex-col justify-center">
      <div className="w-full" ref={calRef}></div>
      <div className="mt-8 flex w-full items-center justify-between">
        <div className="flex gap-2">
          <a
            className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-base font-medium text-black transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
            href="#"
            onClick={e => {
              e.preventDefault()
              calInstance.current?.previous()
            }}
          >
            ←
          </a>
          <a
            className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-base font-medium text-black transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
            href="#"
            onClick={e => {
              e.preventDefault()
              calInstance.current?.next()
            }}
          >
            →
          </a>
        </div>
        <div ref={legendRef} className="flex justify-end"></div>
      </div>
    </div>
  )
}
