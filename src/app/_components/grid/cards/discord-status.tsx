'use client'
import React, { useEffect, useState } from 'react'
import { DiscordLogo } from '@phosphor-icons/react'

const USER_ID = process.env.NEXT_PUBLIC_DISCORD_USER_ID || ''
const WS_URL = 'wss://api.lanyard.rest/socket'

type DiscordStatusType = 'online' | 'idle' | 'dnd' | 'offline'

function getLogoColor(status: DiscordStatusType) {
  switch (status) {
    case 'online':
      return '#43b581' // green
    case 'idle':
      return '#faa61a' // yellow
    case 'dnd':
      return '#f04747' // red
    default:
      return '#c0c0c0ff' // grey
  }
}

export function DiscordStatus() {
  const [status, setStatus] = useState<DiscordStatusType | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null
    let heartbeat: NodeJS.Timeout
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
      const { t: type, d: data } = JSON.parse(event.data)
      if (type === 'INIT_STATE' || type === 'PRESENCE_UPDATE') {
        setStatus(data.discord_status)
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

  return (
    <div
      className="flex h-36 w-fit items-center justify-center overflow-hidden rounded-xl p-2"
      style={{ background: '#5865F2' }}
    >
      <div className="relative flex -rotate-12 items-center justify-center gap-[0.35rem]">
        <DiscordLogo
          size="1em"
          className="absolute -bottom-6 -z-50 h-40 w-40 -rotate-45"
          style={{ color: getLogoColor(status ?? 'offline') }}
        />
        <p className="flex flex-col items-start text-xl font-semibold text-white">
          <span className="relative mb-1 block min-h-[1.5em] text-xl font-bold">
            {/* Skeleton Loader */}
            <span
              className={`absolute left-0 top-0 transition-opacity duration-300 ${status === null ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
              <span className="inline-block h-5 w-16 animate-pulse rounded bg-white/30 align-middle" />
            </span>
            {/* Status Text */}
            <span
              className={`transition-opacity duration-300 ${status === null ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
              {status === 'online' && 'Online'}
              {status === 'idle' && 'Idle'}
              {status === 'dnd' && 'DND'}
              {status === 'offline' && 'Offline'}
            </span>
          </span>
          <span className="text-sm">(@andatoshiki)</span>
        </p>
      </div>
    </div>
  )
}
