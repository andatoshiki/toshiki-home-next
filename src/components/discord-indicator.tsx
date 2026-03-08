import React, { useEffect, useState } from 'react'
import { MenuTooltip } from './ui/tooltip'

// Types for Lanyard data (simplified for this example)
interface Activity {
  name: string
  type: number
  state?: string
  details?: string
}

interface LanyardData {
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  activities: Activity[]
}

const USER_ID = process.env.NEXT_PUBLIC_DISCORD_USER_ID || ''
const WS_URL = 'wss://api.lanyard.rest/socket'

function getStatusDetails(lanyard: LanyardData | null): string {
  if (!lanyard) return ''
  if (lanyard.discord_status === 'offline') return 'Offline'
  if (lanyard.discord_status === 'dnd') return 'Do Not Disturb'
  if (lanyard.discord_status === 'idle') return 'Idle'
  return 'Online'
}

function getDiscordStatusColor(status: string) {
  switch (status) {
    case 'online':
      return 'bg-green-500'
    case 'idle':
      return 'bg-yellow-500'
    case 'dnd':
      return 'bg-red-500'
    default:
      return 'bg-gray-500 dark:bg-gray-200'
  }
}

function parseMarkdownBold(str: string) {
  // Replace **text** with <strong>text</strong>
  return str.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-medium text-neutral-700 dark:text-neutral-200">$1</strong>'
  )
}

export function DiscordStatus() {
  const [lanyard, setLanyard] = useState<LanyardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [newData, setNewData] = useState(false)

  useEffect(() => {
    let ws: WebSocket | null = null
    let heartbeat: NodeJS.Timeout
    setLoading(true)
    ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      ws?.send(
        JSON.stringify({
          op: 2,
          d: { subscribe_to_id: USER_ID }
        })
      )
    }
    ws.onmessage = event => {
      const { t: type, d: status } = JSON.parse(event.data)
      if (type === 'INIT_STATE' || type === 'PRESENCE_UPDATE') {
        setLanyard(status)
        setNewData(v => !v)
        setLoading(false)
      }
    }
    heartbeat = setInterval(() => {
      ws?.send(JSON.stringify({ op: 3 }))
    }, 30000)
    return () => {
      ws?.close()
      clearInterval(heartbeat)
    }
  }, [])

  const statusDetails = getStatusDetails(lanyard)
  const safeHtml = parseMarkdownBold(statusDetails)
  const statusColor = getDiscordStatusColor(lanyard?.discord_status || '')

  if (loading) {
    return (
      <div className="flex items-center space-x-2 rounded-md text-neutral-500">
        <span className="h-3 w-3 flex-shrink-0 animate-pulse rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span className="h-3 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 rounded-md text-neutral-500">
      {/* Status Icon */}
      <span
        className={`h-3 w-3 flex-shrink-0 rounded-full ${statusColor} relative`}
      >
        <span
          className={`animate-bubble absolute inset-0 scale-75 rounded-full opacity-60 ${statusColor}`}
        />
      </span>
      {/* Status Text with MenuTooltip */}
      <MenuTooltip label="Discord Status">
        <div
          className="cursor-help truncate text-sm leading-tight"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </MenuTooltip>
    </div>
  )
}
