'use client'

import { useState, useEffect } from 'react'
import { Receipt } from '@phosphor-icons/react'
import { ParticleDisintegrate } from '~/app/_components/grid/cards/ticket-printer/particle-disintegrate'
import { TicketRamblingId } from '~/app/_components/grid/cards/ticket-printer/ticket-rambling'

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
    <div className="relative flex aspect-square min-h-[8rem] w-full flex-col items-center justify-between overflow-visible rounded-2xl border-2 border-amber-900/30 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 p-2 shadow-md transition-all duration-500 dark:border-amber-800/40 dark:from-amber-950 dark:via-amber-900 dark:to-amber-950">
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
                <div className="text-[9px] font-bold">VISITOR RECEIPT</div>
                <div className="text-[6px] text-neutral-500">
                  Thank you for visiting!
                </div>
              </div>

              <div className="mt-1.5 space-y-0.5">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{visitorInfo.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{visitorInfo.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>OS:</span>
                  <span>{visitorInfo.os}</span>
                </div>
                <div className="flex justify-between">
                  <span>Browser:</span>
                  <span>{visitorInfo.browser}</span>
                </div>
                <div className="flex justify-between">
                  <span>Screen:</span>
                  <span>{visitorInfo.screenSize}</span>
                </div>
              </div>

              <div className="mt-1.5 border-t border-dashed border-neutral-400 pt-1.5 text-center">
                <div className="text-[6px] text-neutral-500">
                  ~ Tap to close ~
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
        <div className="flex w-full items-center justify-between px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-inner dark:bg-amber-600/40" />
          <div className="font-mono text-[6px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-400/50">
            TOSHIKI
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-inner dark:bg-amber-600/40" />
        </div>

        {/* Retro LCD Screen with status indicator */}
        <div className="flex w-full items-center gap-1.5">
          {/* Status indicator LED */}
          <div
            className={`h-2 w-2 rounded-full shadow-sm ${isPrinting ? 'animate-pulse bg-amber-400 dark:bg-amber-500' : 'bg-green-500 dark:bg-green-400'}`}
          />

          <div className="flex flex-1 flex-col items-center justify-center rounded border border-stone-600/40 bg-gradient-to-b from-stone-300 to-stone-400 px-2 py-1 shadow-inner dark:border-stone-700/50 dark:from-stone-700 dark:to-stone-800">
            <div className="min-h-[1.5em] font-mono text-[9px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              {lcdState === 'rambling' ? (
                <TicketRamblingId
                  length={LCD_DIGITS}
                  duration={2000}
                  onDone={handleRamblingDone}
                />
              ) : lcdState === 'id' && visitorId ? (
                visitorId
              ) : (
                LCD_PLACEHOLDER
              )}
            </div>
          </div>
        </div>

        {/* Paper feed area with slot */}
        <div className="relative flex w-full flex-col items-center gap-0.5">
          {/* Feed roller texture */}
          <div className="flex w-[85%] justify-center gap-[2px]">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-0.5 w-1 rounded-full bg-amber-800/20 dark:bg-amber-600/30"
              />
            ))}
          </div>
          {/* Paper slot */}
          <div className="h-1.5 w-[85%] rounded-sm bg-gradient-to-b from-amber-900/40 via-amber-950/60 to-amber-900/40 shadow-inner dark:from-amber-950 dark:via-black dark:to-amber-950" />
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="w-full rounded-lg border border-stone-500/40 bg-gradient-to-b from-stone-500 to-stone-600 px-2 py-1.5 font-mono text-[8px] font-bold uppercase tracking-wide text-stone-100 shadow-md transition-all hover:from-stone-400 hover:to-stone-500 active:scale-[0.97] active:shadow-sm disabled:opacity-50 dark:border-stone-600/50 dark:from-stone-600 dark:to-stone-700"
        >
          <div className="flex items-center justify-center gap-1">
            <Receipt size={10} weight="bold" />
            <span>Print</span>
          </div>
        </button>

        {/* Bottom decorative screws */}
        <div className="flex w-full justify-between px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-inner dark:bg-amber-600/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-inner dark:bg-amber-600/40" />
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
