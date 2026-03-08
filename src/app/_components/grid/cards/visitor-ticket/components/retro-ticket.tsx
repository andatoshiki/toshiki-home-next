import { RefObject } from 'react'
import { VisitorInfo } from '../utils/visitor-info'
import { PerforatedEdge } from './perforated-edge'
import { RetroTicketStub } from './retro-ticket-stub'
import { RetroTicketMain } from './retro-ticket-main'

interface RetroTicketProps {
  visitorInfo: VisitorInfo
  visitorId: string
  isReady: boolean
  onClose: () => void
  slotRef: RefObject<HTMLDivElement>
}

export function RetroTicket({
  visitorInfo,
  visitorId,
  isReady,
  onClose,
  slotRef
}: RetroTicketProps) {
  return (
    <div className="absolute left-1/2 top-[55%] z-[100] w-24 origin-top -translate-x-1/2">
      <div
        className={`relative flex w-full min-w-[6rem] cursor-pointer flex-col overflow-hidden rounded-sm bg-gradient-to-br from-amber-50 to-amber-100 shadow-2xl transition-all duration-300 ${
          isReady
            ? 'hover:shadow-3xl cursor-pointer hover:scale-[1.02]'
            : 'cursor-not-allowed opacity-90'
        } dark:from-amber-950/50 dark:to-amber-900/50`}
        onClick={isReady ? onClose : undefined}
        data-ticket="true"
        role="button"
        tabIndex={isReady ? 0 : -1}
        aria-label={isReady ? 'Click to close ticket' : 'Ticket generating'}
        onKeyDown={e => {
          if (isReady && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onClose()
          }
        }}
      >
        {/* Top Perforated Edge */}
        <PerforatedEdge position="top" />

        {/* Ticket Stub */}
        <RetroTicketStub visitorInfo={visitorInfo} visitorId={visitorId} />

        {/* Perforated Tear Line */}
        <div className="relative h-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent dark:via-amber-800/50">
          <div className="absolute left-0 right-0 top-0 flex justify-center gap-[2px]">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="h-full w-[1px] bg-amber-400/60 dark:bg-amber-700/60"
              />
            ))}
          </div>
        </div>

        {/* Main Ticket */}
        <RetroTicketMain
          visitorInfo={visitorInfo}
          visitorId={visitorId}
          isReady={isReady}
        />

        {/* Bottom Perforated Edge */}
        <PerforatedEdge position="bottom" />
      </div>
    </div>
  )
}
