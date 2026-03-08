'use client'

import Image from 'next/image'
import { MediaListEntry } from './types'
import { StatusBadge } from './status-badge'

interface MediaCardProps {
  entry: MediaListEntry
}

export function MediaCard({ entry }: MediaCardProps) {
  const { media, score, status } = entry
  const title = media.title.english || media.title.romaji || media.title.native

  return (
    <a
      href={media.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Poster Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <StatusBadge status={status} media={media} />
        <Image
          src={media.coverImage.extraLarge || media.coverImage.large}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        {media.description && (
          <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
            {media.description.replace(/<[^>]*>/g, '')}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span>{score > 0 ? score.toFixed(1) : 'N/A'}</span>
          </span>
          {media.episodes && <span>{media.episodes} eps</span>}
          {media.chapters && <span>{media.chapters} chs</span>}
        </div>
      </div>

      {/* Progress Bar */}
      {(media.episodes || media.chapters) && (
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Progress</span>
            <span>
              {entry.progress}/{media.episodes || media.chapters}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full bg-neutral-400 transition-all dark:bg-neutral-200"
              style={{
                width: `${Math.min((entry.progress / (media.episodes || media.chapters || 1)) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      )}
    </a>
  )
}
