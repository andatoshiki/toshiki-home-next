'use client'

import { useRef } from 'react'
import { useVisitorTicket } from './hooks/use-visitor-ticket'
import { RetroMachineHousing } from './components/retro-machine-housing'
import { RetroLCDDisplay } from './components/retro-lcd-display'
import { RetroPaperSlot } from './components/retro-paper-slot'
import { RetroPrintButton } from './components/retro-print-button'
import { RetroTicket } from './components/retro-ticket'
import { TicketDisintegration } from './ticket-disintegration'

export function VisitorTicketCard() {
  const slotRef = useRef<HTMLDivElement>(null)
  const {
    state,
    actions: { print, close, onDisintegrationComplete, setVisitorId }
  } = useVisitorTicket()

  const handleRamblingDone = (id: string) => {
    setVisitorId(id)
  }

  return (
    <div className="relative flex aspect-square min-h-[8rem] w-full flex-col items-center justify-center overflow-visible">
      {/* Retro Ticket Machine Housing */}
      <RetroMachineHousing>
        {/* LCD Display */}
        <RetroLCDDisplay
          isPrinting={state.isPrinting}
          visitorId={state.visitorId}
          onRamblingDone={handleRamblingDone}
        />

        {/* Paper Feed Slot */}
        <RetroPaperSlot ref={slotRef} isPrinting={state.isPrinting} />

        {/* Print Button */}
        <RetroPrintButton isPrinting={state.isPrinting} onPrint={print} />
      </RetroMachineHousing>

      {/* Retro Ticket */}
      {state.showTicket && (
        <RetroTicket
          key={`ticket-${state.visitorId || 'generating'}`}
          visitorInfo={state.visitorInfo}
          visitorId={state.visitorId || 'GENERATING'}
          isReady={state.isReady}
          onClose={close}
          slotRef={slotRef}
        />
      )}

      {/* Disintegration Effect */}
      {state.isDisintegrating && (
        <TicketDisintegration
          trigger={state.isDisintegrating}
          slotRef={slotRef}
          onComplete={onDisintegrationComplete}
        />
      )}
    </div>
  )
}
