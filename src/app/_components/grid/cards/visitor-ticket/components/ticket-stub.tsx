import { VisitorInfo } from '../utils/visitor-info'

interface TicketStubProps {
  visitorInfo: VisitorInfo
}

export function TicketStub({ visitorInfo }: TicketStubProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 px-3 py-2 dark:from-amber-950/30 dark:to-amber-900/30">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[7px] font-bold text-amber-900 dark:text-amber-200">
            VISITOR
          </div>
          <div className="mt-0.5 font-mono text-[6px] text-amber-700 dark:text-amber-300">
            {visitorInfo.date}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[8px] font-bold text-amber-900 dark:text-amber-200">
            #{visitorInfo.screenSize.split('x')[0]}
          </div>
          <div className="mt-0.5 text-[6px] text-amber-600 dark:text-amber-400">
            Keep this stub
          </div>
        </div>
      </div>
    </div>
  )
}
