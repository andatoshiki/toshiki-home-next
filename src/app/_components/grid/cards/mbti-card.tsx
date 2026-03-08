import Image from 'next/image'
import Link from 'next/link'

const INTP_TRAITS = [
  { text: 'Logical', size: 'text-sm', weight: 'font-semibold' },
  { text: 'Analytical', size: 'text-xs', weight: 'font-medium' },
  { text: 'Independent', size: 'text-[11px]', weight: 'font-medium' },
  { text: 'Creative', size: 'text-sm', weight: 'font-semibold' },
  { text: 'Curious', size: 'text-[10px]', weight: 'font-normal' },
  { text: 'Inventive', size: 'text-xs', weight: 'font-medium' },
  { text: 'Abstract', size: 'text-[11px]', weight: 'font-medium' }
  // { text: 'Reserved', size: 'text-[10px]', weight: 'font-normal' },
  // { text: 'Objective', size: 'text-xs', weight: 'font-medium' },
]

export function MbtiCard() {
  return (
    <Link
      href="https://www.16personalities.com/intp-personality"
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex h-36 w-full items-center justify-between gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-all duration-500 hover:scale-[.97] dark:border-neutral-800 dark:bg-neutral-950"
    >
      {/* Left Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            INTP
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            Logician
          </span>
        </div>
        {/* Word Cloud */}
        <div className="flex max-w-[140px] flex-wrap gap-x-2 gap-y-1">
          {INTP_TRAITS.map((trait, index) => (
            <span
              key={trait.text}
              className={`${trait.size} ${trait.weight} text-neutral-600 dark:text-neutral-400`}
              style={{ opacity: 0.6 + (index % 3) * 0.2 }}
            >
              {trait.text}
            </span>
          ))}
        </div>
      </div>

      {/* Character Image */}
      <div className="flex flex-shrink-0 items-center justify-center">
        <Image
          src="https://cdn.tosh1ki.de/assets/images/20260106201703.svg"
          alt="INTP Character"
          width={125}
          height={125}
          className="object-contain"
        />
      </div>
    </Link>
  )
}
