'use client'

import Image from 'next/image'
import Link from 'next/link'
import { UsesEntry } from '.velite'

interface HardwareCardProps {
  item: UsesEntry
}

export function HardwareCard({ item }: HardwareCardProps) {
  const Wrapper = item.url ? Link : 'div'
  const wrapperProps = item.url
    ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className="group/hardware flex min-h-28 items-center gap-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white/50 p-3 pr-5 transition-all hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
    >
      {/* Image Container */}
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900 sm:h-24 sm:w-24">
        <div className="relative h-16 w-16 scale-95 transition-transform duration-200 group-hover/hardware:scale-100 sm:h-20 sm:w-20">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_2px_5px_rgba(255,255,255,0.15)]"
            sizes="80px"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 py-1">
        <h3 className="truncate text-sm font-medium text-neutral-900 transition-colors group-hover/hardware:text-neutral-700 dark:text-neutral-100 dark:group-hover/hardware:text-white">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500 transition-colors group-hover/hardware:text-neutral-600 dark:text-neutral-400 dark:group-hover/hardware:text-neutral-300">
          {item.description}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  )
}
