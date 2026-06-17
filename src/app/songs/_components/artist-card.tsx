import React from 'react'
import { UserCircle, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
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
  const playLabel = `${plays.toLocaleString()} ${plays === 1 ? 'play' : 'plays'}`

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
        className
      )}
      {...props}
    >
      <div className="relative w-20 flex-shrink-0 self-stretch overflow-hidden border-r border-neutral-200 bg-neutral-100 dark:border-neutral-800/70 dark:bg-neutral-900">
        {image ? (
          <>
            <Image
              src={image}
              alt={name}
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
            <UserCircle
              size={32}
              weight="duotone"
              aria-hidden="true"
              className="text-neutral-300 dark:text-neutral-700"
            />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-2.5 pl-3.5 pr-2">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-neutral-800 transition-colors group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-white">
            {name}
          </h3>
          <p className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
            Artist
          </p>
        </div>
        <p className="mt-auto pt-1.5 text-[0.6875rem] tabular-nums leading-none text-neutral-400 dark:text-neutral-500">
          {playLabel}
        </p>
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
