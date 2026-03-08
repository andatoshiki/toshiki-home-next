import { VisitorInfo } from '../utils/visitor-info'

interface RetroTicketMainProps {
  visitorInfo: VisitorInfo
  visitorId: string
  isReady: boolean
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-dashed border-amber-300/50 py-1.5 last:border-0 dark:border-amber-800/50">
      <span className="font-mono text-[7px] font-medium text-amber-800 dark:text-amber-300">
        {label}
      </span>
      <span className="font-mono text-[7px] font-bold text-amber-900 dark:text-amber-200">
        {value}
      </span>
    </div>
  )
}

export function RetroTicketMain({
  visitorInfo,
  visitorId,
  isReady
}: RetroTicketMainProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white px-4 py-3 dark:from-amber-950/30 dark:to-amber-900/20">
      {/* Header */}
      <div className="mb-3 border-b-2 border-amber-900 pb-2 text-center dark:border-amber-200">
        <div className="font-mono text-[11px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
          Visitor Ticket
        </div>
        <div className="mt-1 font-mono text-[6px] font-medium text-amber-600 dark:text-amber-400">
          Thank you for visiting!
        </div>
      </div>

      {/* Visitor ID */}
      <div className="mb-2 rounded border border-amber-300/50 bg-amber-100/50 px-2 py-1 text-center dark:border-amber-800/50 dark:bg-amber-950/30">
        <div className="font-mono text-[7px] font-medium text-amber-700 dark:text-amber-300">
          Visitor ID
        </div>
        <div className="mt-0.5 font-mono text-[9px] font-bold tracking-wider text-amber-900 dark:text-amber-200">
          {visitorId === 'GENERATING' ? 'GENERATING...' : visitorId}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-0.5">
        <TicketRow label="Date:" value={visitorInfo.date} />
        <TicketRow label="Time:" value={visitorInfo.time} />
        <TicketRow label="OS:" value={visitorInfo.os} />
        <TicketRow label="Browser:" value={visitorInfo.browser} />
        <TicketRow label="Screen:" value={visitorInfo.screenSize} />
      </div>

      {/* Footer */}
      <div className="mt-3 border-t-2 border-amber-900 pt-2 text-center dark:border-amber-200">
        <div className="font-mono text-[6px] font-medium text-amber-600 dark:text-amber-400">
          {isReady ? 'Tap to close' : 'Generating...'}
        </div>
      </div>
    </div>
  )
}
