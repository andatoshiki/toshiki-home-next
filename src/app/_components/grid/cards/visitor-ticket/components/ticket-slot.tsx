import { forwardRef } from 'react'

const TicketSlotComponent = forwardRef<HTMLDivElement>(
  function TicketSlot(_, ref) {
    return (
      <div ref={ref} className="relative w-full">
        {/* Slot opening with teeth */}
        <div className="relative w-full">
          {/* Top teeth */}
          <div className="flex justify-center gap-[1px]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`top-${i}`}
                className="h-1 w-[3px] rounded-t-sm bg-neutral-400/60 dark:bg-neutral-600/60"
              />
            ))}
          </div>
          {/* Slot body */}
          <div className="h-3 rounded-b-sm bg-gradient-to-b from-neutral-300 via-neutral-400/80 to-neutral-500 shadow-inner dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-900" />
          {/* Bottom teeth */}
          <div className="flex justify-center gap-[1px]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="h-1 w-[3px] rounded-b-sm bg-neutral-400/60 dark:bg-neutral-600/60"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
)

TicketSlotComponent.displayName = 'TicketSlot'

export const TicketSlot = TicketSlotComponent
