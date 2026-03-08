import React from 'react'
import Ramble from '../../../../src/app/_components/grid/cards/ticket-printer/ramble-ticket-text'

/**
 * RambleDemo: Demo for the rambling text effect.
 *
 * Obstacle: Making the animation feel arcade-like and not just a typewriter.
 * Trick: Scramble with random characters, then reveal the real text after a set duration.
 */
export default function RambleDemo() {
  return (
    <div className="font-mono text-lg">
      <Ramble duration={3000}>Thank you for visiting!</Ramble>
    </div>
  )
}
