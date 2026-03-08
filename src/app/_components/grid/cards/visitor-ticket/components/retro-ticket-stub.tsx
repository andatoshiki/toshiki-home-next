import { VisitorInfo } from '../utils/visitor-info'

interface RetroTicketStubProps {
  visitorInfo: VisitorInfo
  visitorId: string
}

export function RetroTicketStub({
  visitorInfo,
  visitorId
}: RetroTicketStubProps) {
  return (
    <div className="bg-gradient-to-br from-amber-100 to-amber-200 px-3 py-2 dark:from-amber-950/40 dark:to-amber-900/40">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[7px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
            Visitor Stub
          </div>
          <div className="mt-0.5 font-mono text-[6px] font-medium text-amber-700 dark:text-amber-300">
            {visitorInfo.date}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[8px] font-bold text-amber-900 dark:text-amber-200">
            ID: {visitorId === 'GENERATING' ? '------' : visitorId.slice(0, 6)}
          </div>
          <div className="mt-0.5 text-[5px] font-medium text-amber-600 dark:text-amber-400">
            Keep this stub
          </div>
        </div>
      </div>
    </div>
  )
}
