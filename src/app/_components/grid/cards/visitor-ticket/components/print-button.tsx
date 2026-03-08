interface PrintButtonProps {
  isPrinting: boolean
  onPrint: () => void
}

export function PrintButton({ isPrinting, onPrint }: PrintButtonProps) {
  return (
    <button
      onClick={onPrint}
      disabled={isPrinting}
      className="w-full rounded-md border-2 border-neutral-400 bg-gradient-to-b from-neutral-600 to-neutral-700 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:from-neutral-500 hover:to-neutral-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-600 dark:from-neutral-700 dark:to-neutral-800 dark:hover:from-neutral-600 dark:hover:to-neutral-700"
    >
      {isPrinting ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Printing...
        </span>
      ) : (
        'Print Ticket'
      )}
    </button>
  )
}
