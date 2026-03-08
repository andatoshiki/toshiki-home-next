import { forwardRef } from 'react'

interface RetroPaperSlotProps {
  isPrinting?: boolean
}

const RetroPaperSlotComponent = forwardRef<HTMLDivElement, RetroPaperSlotProps>(
  function RetroPaperSlot({ isPrinting = false }, ref) {
    return (
      <div
        ref={ref}
        className="relative flex w-full flex-col items-center gap-0.5"
        aria-label="Paper feed slot"
      >
        {/* Slot opening with teeth/ridges */}
        <div className="relative flex w-full justify-center">
          {/* Top ridge */}
          <div className="absolute -top-0.5 left-0 right-0 flex justify-center gap-[1.5px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`top-${i}`}
                className="h-0.5 w-1 rounded-full bg-neutral-800 dark:bg-neutral-400"
              />
            ))}
          </div>

          {/* Slot opening */}
          <div className="relative mx-auto h-2 w-[92%] rounded-sm border border-neutral-300 bg-black shadow-inner dark:border-neutral-600 dark:bg-neutral-400">
            {/* Printing indicator (subtle glow when printing) */}
            {isPrinting && (
              <div className="absolute inset-0 animate-pulse rounded-sm bg-neutral-500/20 dark:bg-neutral-300/20" />
            )}
          </div>

          {/* Bottom ridge */}
          <div className="absolute -bottom-0.5 left-0 right-0 flex justify-center gap-[1.5px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="h-0.5 w-1 rounded-full bg-neutral-800 dark:bg-neutral-400"
              />
            ))}
          </div>
        </div>

        {/* Slot label */}
        <div className="mt-0.5 text-center">
          <div className="font-mono text-[5px] font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Paper Feed
          </div>
        </div>
      </div>
    )
  }
)

RetroPaperSlotComponent.displayName = 'RetroPaperSlot'

export const RetroPaperSlot = RetroPaperSlotComponent
