'use client'

import Image from 'next/image'
import Link from 'next/link'
import { UsesEntry } from '.velite'

interface UsesCardProps {
  item: UsesEntry
}

export function UsesCard({ item }: UsesCardProps) {
  return (
    <Link
      href={item.url || '#'}
      target={item.url ? '_blank' : undefined}
      rel={item.url ? 'noopener noreferrer' : undefined}
      className="group flex flex-col gap-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            {item.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {item.description}
          </p>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
