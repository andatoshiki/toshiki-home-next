'use client'

import Image from 'next/image'
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
    <div className="relative -mx-3 overflow-hidden md:-mx-4 md:rounded-3xl">
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
      <ol className="relative m-0 grid list-none grid-cols-[repeat(3,minmax(0,120px))] items-center justify-center gap-6 px-3 py-6 shadow-[0_0_4px_2px_rgba(0,0,0,0.15)] backdrop-blur-md backdrop-saturate-[1.25] dark:shadow-[0_0_4px_2px_rgba(255,255,255,0.1)] min-[375px]:grid-cols-[repeat(3,minmax(0,108px))] min-[425px]:grid-cols-[repeat(4,minmax(0,108px))] sm:grid-cols-[repeat(5,minmax(0,108px))] sm:px-6 sm:py-12 md:grid-cols-[repeat(6,minmax(0,108px))] lg:grid-cols-[repeat(7,minmax(0,108px))]">
        {sortedItems.map(item => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onItemClick?.(item)}
              title={item.name}
              className="group/software flex w-full cursor-pointer flex-col items-center gap-1 rounded-lg pb-1 no-underline outline-none transition hover:underline hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 dark:hover:decoration-white"
            >
              {/* App Icon */}
              <div className="relative h-12 w-12 scale-95 transition-transform duration-200 ease-out group-hover/software:scale-100 min-[375px]:h-14 min-[375px]:w-14 min-[425px]:h-16 min-[425px]:w-16 sm:h-[72px] sm:w-[72px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="border-none object-cover drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all dark:drop-shadow-[0_2px_5px_rgba(255,255,255,0.25)]"
                  sizes="(min-width: 640px) 72px, 64px"
                />
              </div>

              {/* App Name */}
              <span className="max-w-[calc(100%-0.25rem)] truncate text-center text-[10px] text-white dark:text-white dark:[text-shadow:0_0_2px_rgba(9,17,34,0.72)] min-[425px]:text-xs">
                {item.name}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
