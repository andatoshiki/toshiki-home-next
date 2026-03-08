import { forwardRef } from 'react'

const PaperFeedAreaComponent = forwardRef<HTMLDivElement>(
  function PaperFeedArea(_, ref) {
    return (
      <div ref={ref} className="relative flex w-full flex-col items-center gap-0.5">
        <div className="flex w-[85%] justify-center gap-[2px]">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-0.5 w-1 rounded-full bg-neutral-800 dark:bg-neutral-400"
            />
          ))}
        </div>
        <div className="h-1.5 w-[85%] rounded-sm border border-neutral-300 bg-black shadow-inner dark:border-neutral-600 dark:bg-neutral-400" />
      </div>
    )
  }
)

PaperFeedAreaComponent.displayName = 'PaperFeedArea'

export const PaperFeedArea = PaperFeedAreaComponent
