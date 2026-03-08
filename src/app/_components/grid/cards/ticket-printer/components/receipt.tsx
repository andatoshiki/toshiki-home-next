import { RefObject } from 'react'
import { ParticleDisintegrate } from '../particle-disintegrate'
import { PerforatedEdge } from './perforated-edge'
import { ReceiptDataRow } from './receipt-data-row'

interface ReceiptProps {
  visitorInfo: {
    date: string
    time: string
    os: string
    browser: string
    screenSize: string
  }
  disintegrate: boolean
  onClose: () => void
  onDisintegrateComplete: () => void
  paperSlotRef?: RefObject<HTMLDivElement>
  isFullyGenerated?: boolean
}

export function Receipt({
  visitorInfo,
  disintegrate,
  onClose,
  onDisintegrateComplete,
  paperSlotRef,
  isFullyGenerated = false
}: ReceiptProps) {
  return (
    <div className="absolute left-1/2 top-[58%] z-40 origin-top -translate-x-1/2">
      <ParticleDisintegrate
        trigger={disintegrate}
        onComplete={onDisintegrateComplete}
        paperSlotRef={paperSlotRef}
      >
        <div
          className={`relative w-24 bg-amber-50 px-2 py-2 font-mono text-[7px] text-neutral-800 shadow-lg ${
            isFullyGenerated ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
          onClick={onClose}
          data-receipt="true"
          style={{
            animation: 'revealReceipt 3s ease-out forwards',
            clipPath: 'inset(-8px 0 100% 0)'
          }}
        >
          <PerforatedEdge position="top" />

          <div className="border-b border-dashed border-neutral-400 pb-1.5 text-center">
            <div className="text-[9px] font-bold">VISITOR RECEIPT</div>
            <div className="text-[6px] text-neutral-500">
              Thank you for visiting!
            </div>
          </div>

          <div className="mt-1.5 space-y-0.5">
            <ReceiptDataRow label="Date:" value={visitorInfo.date} />
            <ReceiptDataRow label="Time:" value={visitorInfo.time} />
            <ReceiptDataRow label="OS:" value={visitorInfo.os} />
            <ReceiptDataRow label="Browser:" value={visitorInfo.browser} />
            <ReceiptDataRow label="Screen:" value={visitorInfo.screenSize} />
          </div>

          <div className="mt-1.5 border-t border-dashed border-neutral-400 pt-1.5 text-center">
            <div className="text-[6px] text-neutral-500">~ Tap to close ~</div>
          </div>

          <PerforatedEdge position="bottom" />
        </div>
      </ParticleDisintegrate>
    </div>
  )
}
