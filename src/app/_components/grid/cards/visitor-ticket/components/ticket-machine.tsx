import { RefObject } from 'react'
import { PrintButton } from './print-button'
import { DisplayPanel } from './display-panel'

interface TicketMachineProps {
  slotRef: RefObject<HTMLDivElement>
  isPrinting: boolean
  visitorId: string | null
  onPrint: () => void
}

export function TicketMachine({
  slotRef,
  isPrinting,
  visitorId,
  onPrint
}: TicketMachineProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      {/* Display Screen */}
      <DisplayPanel isPrinting={isPrinting} visitorId={visitorId} />

      {/* Ticket Slot (hidden but used for positioning) */}
      <div ref={slotRef} className="h-0 w-0" />

      {/* Print Button */}
      <PrintButton isPrinting={isPrinting} onPrint={onPrint} />
    </div>
  )
}
