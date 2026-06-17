import React from 'react'
import { StarFour, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
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
  align?: 'top' | 'center'
}

function NowPlaying() {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
      <span className="flex h-2.5 items-end gap-[2px]" aria-hidden="true">
        <span className="h-full w-px origin-bottom animate-equalize rounded-full bg-current [animation-delay:-0.4s]" />
        <span className="h-full w-px origin-bottom animate-equalize rounded-full bg-current [animation-delay:-0.15s]" />
        <span className="h-full w-px origin-bottom animate-equalize rounded-full bg-current [animation-delay:-0.65s]" />
      </span>
      now playing
    </span>
  )
}

export function SongCard({
  className,
  name,
  artist,
  image,
  url,
  plays,
  nowPlaying = false,
  align = 'top',
  ...props
}: SongCardProps) {
  const hasPlayCount = typeof plays === 'number'
  const playLabel = hasPlayCount
    ? `${plays.toLocaleString()} ${plays === 1 ? 'play' : 'plays'}`
    : null
  const showMeta = Boolean(playLabel) || nowPlaying
  const isCentered = align === 'center'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex min-h-20 max-w-full overflow-hidden rounded-xl border',
        'border-neutral-200 bg-white transition-[border-color,background-color] duration-300',
        'hover:border-neutral-300 hover:bg-neutral-50/60',
        'dark:border-neutral-800/70 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/40',
        nowPlaying &&
          'border-emerald-500/40 bg-emerald-50/40 hover:border-emerald-500/60 dark:border-emerald-400/25 dark:bg-emerald-500/[0.03] dark:hover:border-emerald-400/40',
        className
      )}
      {...props}
    >
      <div className="relative w-20 flex-shrink-0 self-stretch overflow-hidden border-r border-neutral-200 bg-neutral-100 dark:border-neutral-800/70 dark:bg-neutral-900">
        {image ? (
          <>
            <Image
              src={image}
              alt={`${name} by ${artist}`}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-transparent dark:from-black/40"
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <StarFour
              size={30}
              weight="duotone"
              aria-hidden="true"
              className="text-neutral-300 dark:text-neutral-700"
            />
          </div>
        )}
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col py-2.5 pl-3.5 pr-2',
          isCentered && 'justify-center'
        )}
      >
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-neutral-800 transition-colors group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-white">
            {name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs leading-tight text-neutral-500 dark:text-neutral-400">
            {artist}
          </p>
        </div>
        {showMeta ? (
          <div
            className={cn(
              'flex items-center gap-2 text-[0.6875rem] leading-none text-neutral-400 dark:text-neutral-500',
              isCentered ? 'mt-1.5' : 'mt-auto pt-1.5'
            )}
          >
            {playLabel ? (
              <span className="tabular-nums">{playLabel}</span>
            ) : null}
            {playLabel && nowPlaying ? (
              <span
                aria-hidden="true"
                className="text-neutral-300 dark:text-neutral-700"
              >
                &middot;
              </span>
            ) : null}
            {nowPlaying ? <NowPlaying /> : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-shrink-0 items-center self-stretch pr-3">
        <ArrowUpRight
          size={15}
          weight="bold"
          aria-hidden="true"
          className="-translate-x-1 text-neutral-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:text-neutral-500"
        />
      </div>
    </a>
  )
}
