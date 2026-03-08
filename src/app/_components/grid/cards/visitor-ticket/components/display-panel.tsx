import { useEffect, useState } from 'react'

interface DisplayPanelProps {
  isPrinting: boolean
  visitorId: string | null
}

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('')
}

export function DisplayPanel({
  isPrinting,
  visitorId
}: DisplayPanelProps) {
  const [displayCode, setDisplayCode] = useState<string>('------')

  useEffect(() => {
    if (isPrinting) {
      const interval = setInterval(() => {
        setDisplayCode(generateRandomCode())
      }, 150)
      return () => clearInterval(interval)
    } else if (visitorId) {
      setDisplayCode(visitorId)
    } else {
      setDisplayCode('------')
    }
  }, [isPrinting, visitorId])

  return (
    <div className="w-full rounded-lg border-2 border-neutral-400 bg-gradient-to-b from-neutral-800 to-neutral-900 p-3 shadow-inner dark:border-neutral-600 dark:from-neutral-900 dark:to-neutral-950">
      <div className="flex flex-col gap-1.5">
        {/* First line: Status */}
        <div className="text-center font-mono text-[10px] font-bold uppercase tracking-wider text-green-400 dark:text-green-300">
          {isPrinting ? 'PRINTING' : 'READY'}
        </div>
        {/* Second line: Unique ID */}
        <div className="text-center font-mono text-[9px] font-bold tracking-wider text-neutral-300 dark:text-neutral-400">
          {displayCode}
        </div>
      </div>
    </div>
  )
}
