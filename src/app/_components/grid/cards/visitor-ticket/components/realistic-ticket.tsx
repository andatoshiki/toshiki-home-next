import { RefObject } from 'react'
import { VisitorInfo } from '../utils/visitor-info'
import { TicketStub } from './ticket-stub'
import { TicketMain } from './ticket-main'
import { PerforatedEdge } from './perforated-edge'

interface RealisticTicketProps {
  visitorInfo: VisitorInfo
  isReady: boolean
  onClose: () => void
  slotRef: RefObject<HTMLDivElement>
}

export function RealisticTicket({
  visitorInfo,
  isReady,
  onClose,
  slotRef
}: RealisticTicketProps) {
  const slotRect = slotRef.current?.getBoundingClientRect()
  const slotTop = slotRect?.top ?? 0

  return (
    <div
      className="absolute left-1/2 z-50 origin-top -translate-x-1/2"
      style={{
        top: `${slotTop}px`
      }}
    >
      <div
        className={`relative flex cursor-pointer flex-col overflow-hidden rounded-sm bg-white shadow-2xl transition-all ${
          isReady
            ? 'hover:shadow-3xl hover:scale-[1.02]'
            : 'cursor-not-allowed opacity-90'
        } dark:bg-neutral-900`}
        onClick={isReady ? onClose : undefined}
        data-ticket="true"
      >
        {/* Top Perforated Edge */}
        <PerforatedEdge position="top" />

        {/* Ticket Stub (smaller portion) */}
        <TicketStub visitorInfo={visitorInfo} />

        {/* Perforated Tear Line */}
        <div className="relative h-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700">
          <div className="absolute left-0 right-0 top-0 flex justify-center gap-[2px]">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="h-full w-[1px] bg-neutral-400 dark:bg-neutral-600"
              />
            ))}
          </div>
        </div>

        {/* Main Ticket */}
        <TicketMain visitorInfo={visitorInfo} isReady={isReady} />

        {/* Bottom Perforated Edge */}
        <PerforatedEdge position="bottom" />
      </div>
    </div>
  )
}
