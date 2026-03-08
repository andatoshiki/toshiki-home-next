import { VisitorInfo } from '../utils/visitor-info'

interface TicketMainProps {
  visitorInfo: VisitorInfo
  isReady: boolean
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-dashed border-neutral-200 py-1.5 last:border-0 dark:border-neutral-700">
      <span className="text-[7px] font-medium text-neutral-600 dark:text-neutral-400">
        {label}
      </span>
      <span className="text-[7px] font-bold text-neutral-900 dark:text-neutral-100">
        {value}
      </span>
    </div>
  )
}

export function TicketMain({ visitorInfo, isReady }: TicketMainProps) {
  return (
    <div className="bg-white px-4 py-3 dark:bg-neutral-900">
      {/* Header */}
      <div className="mb-3 border-b-2 border-neutral-900 pb-2 text-center dark:border-neutral-100">
        <div className="text-[11px] font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
          Visitor Ticket
        </div>
        <div className="mt-1 text-[6px] text-neutral-500 dark:text-neutral-400">
          Thank you for visiting!
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
      <div className="mt-3 border-t-2 border-neutral-900 pt-2 text-center dark:border-neutral-100">
        <div className="text-[6px] font-medium text-neutral-500 dark:text-neutral-400">
          {isReady ? 'Tap to close' : 'Generating...'}
        </div>
      </div>
    </div>
  )
}
