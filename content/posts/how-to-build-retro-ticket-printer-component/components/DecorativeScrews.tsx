import React from 'react'

/**
 * DecorativeScrews: Adds retro screw visuals to the card corners.
 *
 * Obstacle: Making simple divs look like metallic screws.
 * Trick: Use rounded-full, background, and shadow for a subtle 3D effect.
 */
export default function DecorativeScrews() {
  return (
    <div className="flex w-full justify-between px-1">
      <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-inner dark:bg-amber-600/40" />
      <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-inner dark:bg-amber-600/40" />
    </div>
  )
}
