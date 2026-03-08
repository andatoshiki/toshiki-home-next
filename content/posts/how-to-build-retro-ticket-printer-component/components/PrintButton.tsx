import React from 'react'
import { Receipt } from '@phosphor-icons/react'

/**
 * PrintButton: The interactive print button for the ticket printer.
 *
 * Obstacle: Making the button feel tactile and responsive.
 * Trick: Use Tailwind gradients, shadow, and scale on active for a "press" effect.
 */
export default function PrintButton({
  onClick,
  disabled
}: {
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-lg border border-stone-500/40 bg-gradient-to-b from-stone-500 to-stone-600 px-2 py-1.5 font-mono text-[8px] font-bold uppercase tracking-wide text-stone-100 shadow-md transition-all hover:from-stone-400 hover:to-stone-500 active:scale-[0.97] active:shadow-sm disabled:opacity-50 dark:border-stone-600/50 dark:from-stone-600 dark:to-stone-700"
    >
      <div className="flex items-center justify-center gap-1">
        <Receipt size={10} weight="bold" />
        <span>Print</span>
      </div>
    </button>
  )
}
