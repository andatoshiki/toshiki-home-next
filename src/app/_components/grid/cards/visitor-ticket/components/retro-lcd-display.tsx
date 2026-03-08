import { ScrambleText } from '../../ticket-printer/components/scramble-text'

const LCD_DIGITS = 10
const LCD_PLACEHOLDER = '0'.repeat(LCD_DIGITS)

interface RetroLCDDisplayProps {
  isPrinting: boolean
  visitorId: string | null
  onRamblingDone: (id: string) => void
}

export function RetroLCDDisplay({
  isPrinting,
  visitorId,
  onRamblingDone
}: RetroLCDDisplayProps) {
  const lcdState = isPrinting
    ? 'rambling'
    : visitorId
      ? 'id'
      : 'ready'

  return (
    <div className="flex w-full items-center">
      {/* LCD Screen */}
      <div className="relative flex w-full flex-col rounded border border-neutral-300 bg-neutral-100 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
        {/* Status Indicator - inside on the left */}
        <div
          className={`absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full transition-all ${
            isPrinting
              ? 'animate-pulse bg-amber-400 dark:bg-amber-500'
              : 'bg-green-500 dark:bg-green-400'
          }`}
          aria-label={isPrinting ? 'Printing' : 'Ready'}
        />

        {/* Screen content */}
        <div className="relative z-10 flex w-full flex-col gap-1">
          {/* Status line */}
          <div className="text-center font-mono text-[8px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            {isPrinting ? 'PRINTING' : 'READY'}
          </div>

          {/* ID line */}
          <div className="flex min-h-[1.2em] w-full justify-end font-mono text-[9px] font-bold tracking-wider text-neutral-700 dark:text-neutral-300">
            {lcdState === 'rambling' ? (
              <ScrambleText
                length={LCD_DIGITS}
                duration={2000}
                mode="progressive"
                onDone={onRamblingDone}
              />
            ) : lcdState === 'id' && visitorId ? (
              <span style={{ fontFamily: 'monospace', letterSpacing: '0.15em' }}>
                {visitorId}
              </span>
            ) : (
              <span
                style={{ fontFamily: 'monospace', letterSpacing: '0.15em' }}
                className="text-neutral-500 dark:text-neutral-600"
              >
                {LCD_PLACEHOLDER}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
