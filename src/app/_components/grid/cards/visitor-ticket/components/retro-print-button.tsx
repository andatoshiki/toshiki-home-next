import { Receipt } from '@phosphor-icons/react'

interface RetroPrintButtonProps {
  isPrinting: boolean
  onPrint: () => void
}

export function RetroPrintButton({
  isPrinting,
  onPrint
}: RetroPrintButtonProps) {
  return (
    <button
      onClick={onPrint}
      disabled={isPrinting}
      className="group relative w-full overflow-hidden rounded-lg border border-neutral-300 bg-neutral-800 px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-neutral-700 hover:border-neutral-400 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 dark:hover:border-neutral-500"
      aria-label={isPrinting ? 'Printing ticket' : 'Print ticket'}
      aria-disabled={isPrinting}
    >
      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-1.5">
        {isPrinting ? (
          <>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span>Printing...</span>
          </>
        ) : (
          <>
            <Receipt size={10} weight="bold" className="shrink-0" />
            <span>Print Ticket</span>
          </>
        )}
      </div>
    </button>
  )
}
