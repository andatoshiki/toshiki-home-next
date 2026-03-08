import { ReactNode } from 'react'

interface RetroMachineHousingProps {
  children: ReactNode
}

export function RetroMachineHousing({ children }: RetroMachineHousingProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-visible rounded-xl border border-neutral-200 bg-white p-3 transition-all duration-500 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Decorative Screws */}
      <div className="absolute left-2 top-2">
        <DecorativeScrew />
      </div>
      <div className="absolute right-2 top-2">
        <DecorativeScrew />
      </div>
      <div className="absolute bottom-2 left-2">
        <DecorativeScrew />
      </div>
      <div className="absolute bottom-2 right-2">
        <DecorativeScrew />
      </div>

      {/* Machine Label */}
      <div className="absolute left-1/2 top-1 -translate-x-1/2">
        <div className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="font-mono text-[6px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            TOSHIKI SYSTEMS
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-full w-full flex-col items-center justify-between pt-4">
        {children}
      </div>
    </div>
  )
}

function DecorativeScrew() {
  return (
    <div className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
  )
}
