import React from 'react'

/**
 * LCDHeader: The retro LCD brand header with screws.
 *
 * Obstacle: Achieving a retro look with minimal markup.
 * Trick: Use flex, uppercase, tracking, and color for a subtle LCD effect.
 */
export default function LCDHeader() {
  return (
    <div className="flex w-full items-center justify-between px-1">
      <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-inner dark:bg-amber-600/40" />
      <div className="font-mono text-[6px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-400/50">
        TOSHIKI
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-inner dark:bg-amber-600/40" />
    </div>
  )
}
