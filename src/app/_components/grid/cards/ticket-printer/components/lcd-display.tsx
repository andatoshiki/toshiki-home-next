import { ScrambleText } from './scramble-text'
import { LCD_DIGITS, LCD_PLACEHOLDER } from '../constants'

interface LCDDisplayProps {
  lcdState: 'ready' | 'rambling' | 'id'
  visitorId: string | null
  isPrinting: boolean
  onRamblingDone: (id: string) => void
}

export function LCDDisplay({
  lcdState,
  visitorId,
  isPrinting,
  onRamblingDone
}: LCDDisplayProps) {
  return (
    <div className="flex w-full items-center">
      <div className="relative flex w-full flex-col rounded border border-neutral-300 bg-neutral-100 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900">
        {/* Status Indicator - inside on the left */}
        <div
          className={`absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full transition-all ${
            isPrinting ? 'animate-pulse bg-amber-400 dark:bg-amber-500' : 'bg-green-500 dark:bg-green-400'
          }`}
          aria-label={isPrinting ? 'Printing' : 'Ready'}
        />
        <div className="flex min-h-[1.5em] w-full justify-end font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
          {lcdState === 'rambling' ? (
            <ScrambleText
              length={LCD_DIGITS}
              duration={2000}
              mode="progressive"
              onDone={onRamblingDone}
            />
          ) : lcdState === 'id' && visitorId ? (
            <span style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
              {visitorId}
            </span>
          ) : (
            <span style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
              {LCD_PLACEHOLDER}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
