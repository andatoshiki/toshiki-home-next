import { DecorativeScrew } from './decorative-screw'

interface BrandHeaderProps {
  brandName: string
}

export function BrandHeader({ brandName }: BrandHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between px-1">
      <DecorativeScrew />
      <div className="font-mono text-[6px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
        {brandName}
      </div>
      <DecorativeScrew />
    </div>
  )
}
