import React, { useState } from 'react'
import ParticleDisintegrate from '../../../../src/app/_components/grid/cards/ticket-printer/particle-disintegrate'

/**
 * ParticleDisintegrateDemo: Demo for the disintegration effect.
 *
 * Obstacle: Integrating a custom particle effect with React state and timing.
 * Trick: Use a trigger prop and onComplete callback to control the effect lifecycle.
 */
export default function ParticleDisintegrateDemo() {
  const [trigger, setTrigger] = useState(false)
  return (
    <div>
      <button
        onClick={() => setTrigger(true)}
        className="mb-2 rounded bg-amber-200 px-2 py-1"
      >
        Trigger Disintegrate
      </button>
      <ParticleDisintegrate
        trigger={trigger}
        onComplete={() => setTrigger(false)}
      >
        <div className="inline-block rounded border border-amber-400 bg-amber-100 px-4 py-2">
          Sample Ticket
        </div>
      </ParticleDisintegrate>
    </div>
  )
}
