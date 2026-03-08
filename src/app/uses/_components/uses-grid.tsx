'use client'

import Image from 'next/image'
import Link from 'next/link'
import { UsesEntry } from '.velite'

interface UsesGridProps {
  items: UsesEntry[]
}

export function UsesGrid({ items }: UsesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map(item => (
        <Link
          key={item.id}
          href={item.url || '#'}
          target={item.url ? '_blank' : undefined}
          rel={item.url ? 'noopener noreferrer' : undefined}
          className="group flex flex-col items-center gap-2 rounded-lg p-4 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-lg transition-transform group-hover:scale-110">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="text-center">
            <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {item.name}
            </h3>
            <p className="line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
