import React from 'react'
import Image from 'next/image'
import { cn } from '~/lib/utils/style'

export interface ArtistCardProps {
  className?: string
  name: string
  plays: number
  image?: string
  url: string
}

export function ArtistCard({
  className,
  name,
  plays,
  image,
  url,
  ...props
}: ArtistCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex min-h-28 max-w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950',
        'cursor-pointer transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900',
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 text-xl font-semibold text-neutral-500 dark:bg-neutral-900">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          '👤'
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {name}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {plays} plays
        </p>
      </div>
    </a>
  )
}
