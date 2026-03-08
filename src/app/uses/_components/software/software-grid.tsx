'use client'

import Image from 'next/image'
import { LinkV2 } from '~/components/ui/link-v2'
import { UsesEntry } from '.velite'

interface SoftwareGridProps {
  items: UsesEntry[]
  backgroundImage?: string
  backgroundImageDark?: string
  onItemClick?: (item: UsesEntry) => void
}

export function SoftwareGrid({
  items,
  backgroundImage,
  backgroundImageDark,
  onItemClick
}: SoftwareGridProps) {
  const sortedItems = [...items].sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Background wallpaper - Light mode */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 dark:hidden"
        style={{
          backgroundImage: backgroundImage
            ? `url('${backgroundImage}')`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6B8DD6 100%)'
        }}
      />
      {/* Background wallpaper - Dark mode */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat opacity-80 dark:block"
        style={{
          backgroundImage: backgroundImageDark
            ? `url('${backgroundImageDark}')`
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        }}
      />

      {/* Grid container with backdrop blur */}
      <ol className="relative m-0 grid list-none grid-cols-3 items-start justify-center gap-6 px-4 py-8 backdrop-blur-md backdrop-saturate-[1.25] sm:px-6 sm:py-10 md:grid-cols-4 md:px-8 md:py-12 lg:grid-cols-5">
        {sortedItems.map(item => (
          <li key={item.id} className="flex justify-center">
            <button
              type="button"
              onClick={() => onItemClick?.(item)}
              title={item.name}
              className="group/software flex w-full max-w-[100px] cursor-pointer flex-col items-center gap-1.5 rounded-lg pb-1 no-underline outline-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              {/* App Icon */}
              <div className="relative h-24 w-24 scale-95 transition-transform duration-200 ease-out group-hover/software:scale-100 sm:h-28 sm:w-28 md:h-28 md:w-28">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="border-none object-cover drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all dark:drop-shadow-[0_2px_5px_rgba(255,255,255,0.25)]"
                  sizes="72px"
                />
              </div>

              {/* App Name */}
              <span className="max-w-full truncate text-center text-xs font-semibold text-white dark:text-white dark:[text-shadow:0_0_2px_rgba(9,17,34,0.72)] sm:text-sm">
                {item.name}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
