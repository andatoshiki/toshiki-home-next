import React from 'react'

/**
 * SlotAndFeed: Visualizes the paper feed rollers and slot.
 *
 * Obstacle: Making the slot and rollers look tactile and 3D with only CSS.
 * Trick: Use flexbox, small divs, and gradients for a convincing effect.
 */
export default function SlotAndFeed() {
  return (
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
  )
}
