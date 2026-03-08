import React from 'react'
import Image from 'next/image'
import { cn } from '~/lib/utils/style'

export interface SongCardProps {
  className?: string
  name: string
  artist: string
  image?: string
  url: string
  plays?: number
  nowPlaying?: boolean
}

export function SongCard({
  className,
  name,
  artist,
  image,
  url,
  plays,
  nowPlaying = false,
  ...props
}: SongCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex min-h-28 max-w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950',
        'cursor-pointer transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900',
        nowPlaying &&
          'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20',
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 text-xl font-semibold text-neutral-500 dark:bg-neutral-900">
        {image ? (
          <Image
            src={image}
            alt={`${name} by ${artist}`}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          '♪'
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {name}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          by {artist}
          {plays && (
            <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500 md:hidden">
              • {plays} plays
            </span>
          )}
        </p>
      </div>
      {plays && (
        <div className="hidden items-center gap-2 md:flex">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {plays} plays
          </span>
        </div>
      )}
      {nowPlaying && (
        <div className="flex items-center gap-2">
          <span className="animate-pulse rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Now Playing
          </span>
        </div>
      )}
    </a>
  )
}
