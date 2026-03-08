import React from 'react'

/**
 * TicketBase: The visual container for the ticket printer card.
 * Handles layout, border, background, and overall structure.
 *
 * Obstacle: Getting the aspect ratio and border radius to look retro but modern.
 * Trick: Use Tailwind's aspect-square and rounded-2xl for a perfect square and soft corners.
 */
export default function TicketBase({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex aspect-square min-h-[8rem] w-full flex-col items-center justify-between overflow-visible rounded-2xl border-2 border-amber-900/30 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 p-2 shadow-md transition-all duration-500 dark:border-amber-800/40 dark:from-amber-950 dark:via-amber-900 dark:to-amber-950">
      {children}
    </div>
  )
}
