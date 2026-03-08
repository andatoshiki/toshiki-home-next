import React from 'react'
import { TicketRamblingId } from '../../../../src/app/_components/grid/cards/ticket-printer/ticket-rambling'

/**
 * LCDIdDemo: Demo for the LCD ticket ID effect.
 *
 * Obstacle: Creating a "hacker"-style ID reveal that feels authentic.
 * Trick: Animate random characters, then reveal a generated ID, using a callback for completion.
 */
export default function LCDIdDemo() {
  return (
    <div className="font-mono text-lg">
      <TicketRamblingId length={10} duration={2000} onDone={() => {}} />
    </div>
  )
}
