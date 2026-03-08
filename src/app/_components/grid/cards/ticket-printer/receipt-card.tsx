'use client'

import { useState, useEffect } from 'react'
import { Receipt } from '@phosphor-icons/react'
import { ParticleDisintegrate } from '~/app/_components/grid/cards/ticket-printer/particle-disintegrate'
import { TicketRamblingId } from '~/app/_components/grid/cards/ticket-printer/ticket-rambling'
import Ramble from '~/app/_components/grid/cards/ticket-printer/ticket-rambling'

function getVisitorInfo() {
  if (typeof window === 'undefined') {
    return {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      os: 'Unknown',
      browser: 'Unknown',
      screenSize: 'Unknown',
      language: 'Unknown',
      timezone: 'Unknown'
    }
  }

  const ua = navigator.userAgent
  let os = 'Unknown'
  let browser = 'Unknown'

  // Detect OS
  if (ua.includes('Win')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  // Detect Browser
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'

  return {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    os,
    browser,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

export function ReceiptCard() {
  const [isPrinting, setIsPrinting] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [visitorInfo, setVisitorInfo] = useState(getVisitorInfo())
  const [disintegrate, setDisintegrate] = useState(false)
  const [lcdState, setLcdState] = useState<'ready' | 'rambling' | 'id'>('ready')
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const LCD_DIGITS = 10
  const LCD_PLACEHOLDER = '0'.repeat(LCD_DIGITS)

  useEffect(() => {
    setVisitorInfo(getVisitorInfo())
  }, [])

  const handlePrint = () => {
    if (isPrinting) return
    setIsPrinting(true)
    setLcdState('rambling')
    setShowReceipt(true)
    setVisitorId(null) // Clear previous id so a new one is generated
    setTimeout(() => {
      setIsPrinting(false)
    }, 2000)
  }

  const handleRamblingDone = (id: string) => {
    setVisitorId(id)
    setLcdState('id')
  }

  const handleClose = () => {
    setDisintegrate(true)
    setTimeout(() => {
      setShowReceipt(false)
      setDisintegrate(false)
      setLcdState('ready')
      setVisitorId(null)
    }, 3000) // Reset to ready after ticket is gone
  }

  return (
    <div className="group relative flex aspect-square min-h-[8rem] w-full flex-col items-center justify-between overflow-visible rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition-all duration-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
      {/* Receipt - comes out from paper slot (moved outside main flex column) */}
      {showReceipt && (
        <div
          className="absolute left-1/2 top-[58%] z-40 origin-top -translate-x-1/2"
          style={{
            animation: 'rollOut 3s ease-out forwards'
          }}
        >
          <ParticleDisintegrate
            trigger={disintegrate}
            onComplete={() => {
              setShowReceipt(false)
              setDisintegrate(false)
            }}
          >
            <div
              className="relative w-24 cursor-pointer bg-amber-50 px-2 py-2 font-mono text-[7px] text-neutral-800 shadow-lg"
              onClick={handleClose}
              style={{
                animation: 'revealReceipt 3s ease-out forwards',
                clipPath: 'inset(-8px 0 100% 0)'
              }}
            >
              {/* Perforated top edge */}
              <div
                className="absolute -top-2 left-0 right-0 h-2"
                style={{
                  background: `linear-gradient(135deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%),\n                            linear-gradient(225deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%)`,
                  backgroundSize: '6px 6px'
                }}
              />

              {/* Receipt Content */}
              <div className="border-b border-dashed border-neutral-400 pb-1.5 text-center">
                <div className="text-[9px] font-bold">
                  <div>VISITOR RECEIPT</div>
                </div>
                <div className="text-[6px] text-neutral-500">
                  <div>Thank you for visiting!</div>
                </div>
              </div>

              <div className="mt-1.5 space-y-0.5">
                <div className="flex justify-between">
                  <span>
                    <Ramble speed={10}>Date:</Ramble>
                  </span>
                  <span>
                    <Ramble speed={10}>{visitorInfo.date}</Ramble>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <Ramble speed={10}>Time:</Ramble>
                  </span>
                  <span>
                    <Ramble speed={10}>{visitorInfo.time}</Ramble>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <Ramble speed={10}>OS:</Ramble>
                  </span>
                  <span>
                    <Ramble speed={10}>{visitorInfo.os}</Ramble>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <Ramble speed={10}>Browser:</Ramble>
                  </span>
                  <span>
                    <Ramble speed={10}>{visitorInfo.browser}</Ramble>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <Ramble speed={10}>Screen:</Ramble>
                  </span>
                  <span>
                    <Ramble speed={10}>{visitorInfo.screenSize}</Ramble>
                  </span>
                </div>
              </div>

              <div className="mt-1.5 border-t border-dashed border-neutral-400 pt-1.5 text-center">
                <div className="text-[6px] text-neutral-500">
                  <div>~ Tap to close ~</div>
                </div>
              </div>

              {/* Perforated bottom edge */}
              <div
                className="absolute -bottom-2 left-0 right-0 h-2"
                style={{
                  background: `linear-gradient(45deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%),\n                            linear-gradient(-45deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%)`,
                  backgroundSize: '6px 6px'
                }}
              />
            </div>
          </ParticleDisintegrate>
        </div>
      )}

      {/* Main flex column content */}
      <div className="flex h-full w-full flex-col items-center justify-between">
        {/* Top section with brand and screws */}
        <div className="flex w-full items-center justify-between">
          <div className="h-2 w-2 rounded-full bg-neutral-400 shadow-sm dark:bg-neutral-600" />
          <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            TOSHIKI
          </div>
          <div className="h-2 w-2 rounded-full bg-neutral-400 shadow-sm dark:bg-neutral-600" />
        </div>

        {/* Retro LCD Screen with status indicator */}
        <div className="w-full rounded border border-neutral-300 bg-neutral-200 px-2.5 py-1.5 shadow-inner transition-all dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between gap-2">
            {/* Status indicator LED inside LCD - uptime style */}
            <div className="relative h-1.5 w-1.5 flex-shrink-0">
              <div
                className={`absolute inset-0 rounded-full transition-all ${isPrinting ? 'animate-pulse bg-yellow-400 dark:bg-yellow-500' : 'bg-green-500 dark:bg-green-400'}`}
              />
              <div
                className={`absolute inset-0 rounded-full blur-sm transition-all ${isPrinting ? 'animate-pulse bg-yellow-400 dark:bg-yellow-500' : 'bg-green-500 dark:bg-green-400'}`}
              />
              <div
                className={`absolute inset-0 rounded-full opacity-60 blur-md transition-all ${isPrinting ? 'animate-pulse bg-yellow-400 dark:bg-yellow-500' : 'bg-green-500 dark:bg-green-400'}`}
              />
            </div>

            {/* LCD Display */}
            <div className="flex flex-1 items-center justify-center">
              <div className="min-h-[1.5em] font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                {lcdState === 'rambling' ? (
                  <TicketRamblingId
                    length={LCD_DIGITS}
                    duration={2000}
                    onDone={handleRamblingDone}
                  />
                ) : lcdState === 'id' && visitorId ? (
                  <span
                    style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}
                  >
                    {visitorId}
                  </span>
                ) : (
                  <span
                    style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}
                  >
                    {LCD_PLACEHOLDER}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Paper feed area with slot */}
        <div className="relative flex w-full flex-col items-center gap-1">
          {/* Feed roller texture */}
          <div className="flex w-[85%] justify-center gap-[3px]">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-1 w-1 rounded-full bg-neutral-400/40 dark:bg-neutral-600/50"
              />
            ))}
          </div>
          {/* Paper slot */}
          <div className="h-2 w-full rounded-sm bg-neutral-900/90 shadow-inner dark:bg-neutral-600/50" />
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="w-full rounded border border-neutral-300 bg-neutral-200 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wide text-neutral-700 shadow-sm transition-all hover:scale-[1.02] hover:border-neutral-400 hover:bg-neutral-300 hover:shadow-md active:scale-[0.98] active:shadow-sm disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
        >
          <div className="flex items-center justify-center gap-1">
            <Receipt size={10} weight="bold" />
            <span>Print</span>
          </div>
        </button>

        {/* Bottom decorative screws */}
        <div className="flex w-full justify-between">
          <div className="h-2 w-2 rounded-full bg-neutral-400 shadow-sm dark:bg-neutral-600" />
          <div className="h-2 w-2 rounded-full bg-neutral-400 shadow-sm dark:bg-neutral-600" />
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes rollOut {
          0% {
            transform: translateX(-50%) translateY(0);
          }
          100% {
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes revealReceipt {
          0% {
            clip-path: inset(-8px 0 100% 0);
          }
          100% {
            clip-path: inset(-8px 0 -8px 0);
          }
        }
      `}</style>
    </div>
  )
}
