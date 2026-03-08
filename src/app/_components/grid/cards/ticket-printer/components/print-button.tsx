import { Receipt } from '@phosphor-icons/react'

interface PrintButtonProps {
  isPrinting: boolean
  onPrint: () => void
}

export function PrintButton({ isPrinting, onPrint }: PrintButtonProps) {
  return (
    <button
      onClick={onPrint}
      disabled={isPrinting}
      className="w-full rounded-lg border border-neutral-300 bg-neutral-800 px-2 py-1.5 font-mono text-[8px] font-bold uppercase tracking-wide text-white transition-all hover:border-neutral-400 hover:bg-neutral-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:border-neutral-500 dark:hover:bg-neutral-600"
    >
      <div className="flex items-center justify-center gap-1">
        <Receipt size={10} weight="bold" />
        <span>Print</span>
      </div>
    </button>
  )
}
