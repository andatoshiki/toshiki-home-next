import React from 'react'

/**
 * RollingReceipt: The animated receipt that rolls out from the slot.
 * Handles absolute positioning, animation, and perforated edges.
 *
 * Obstacle: Simulating a paper roll-out with only CSS and React.
 * Trick: Use absolute positioning, custom keyframes, and CSS gradients for perforation.
 */
export default function RollingReceipt({
  children,
  show,
  onClick
}: {
  children: React.ReactNode
  show: boolean
  onClick?: () => void
}) {
  if (!show) return null
  return (
    <div
      className="absolute left-1/2 top-[58%] z-40 origin-top -translate-x-1/2"
      style={{ animation: 'rollOut 3s ease-out forwards' }}
    >
      <div
        className="relative w-24 cursor-pointer bg-amber-50 px-2 py-2 font-mono text-[7px] text-neutral-800 shadow-lg"
        onClick={onClick}
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
        {children}
        {/* Perforated bottom edge */}
        <div
          className="absolute -bottom-2 left-0 right-0 h-2"
          style={{
            background: `linear-gradient(45deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%),\n                            linear-gradient(-45deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%)`,
            backgroundSize: '6px 6px'
          }}
        />
      </div>
    </div>
  )
}
