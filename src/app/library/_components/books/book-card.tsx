'use client'

import Image from 'next/image'
import { BookEntry } from './types'
import {
  Star,
  BookOpen,
  BookBookmark,
  Heart,
  XCircle
} from '@phosphor-icons/react'

interface BookCardProps {
  book: BookEntry
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  CURRENTLY_READING: <BookOpen className="h-3 w-3" weight="fill" />,
  WANT_TO_READ: <BookBookmark className="h-3 w-3" weight="fill" />,
  READ: <Heart className="h-3 w-3" weight="fill" />,
  DID_NOT_FINISH: <XCircle className="h-3 w-3" weight="fill" />
}

const STATUS_COLORS: Record<string, string> = {
  CURRENTLY_READING: 'bg-blue-600',
  WANT_TO_READ: 'bg-amber-600',
  READ: 'bg-green-600',
  DID_NOT_FINISH: 'bg-red-600',
  OWNED: 'bg-purple-600'
}

export function BookCard({ book }: BookCardProps) {
  return (
    <a
      href={book.hardcoverUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
            <BookOpen className="mb-2 h-8 w-8 text-neutral-400" weight="thin" />
            <span className="line-clamp-3 text-xs text-neutral-500">
              {book.title}
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute left-2 top-2 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${STATUS_COLORS[book.status] || 'bg-neutral-600'}`}
        >
          {STATUS_ICONS[book.status]}
          <span className="hidden sm:inline">{book.statusDisplay}</span>
        </div>

        {/* User Rating Badge */}
        {book.rating && (
          <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-bold text-white">
            <Star className="h-3 w-3 text-yellow-400" weight="fill" />
            {book.rating}
          </div>
        )}

        {/* Starred indicator */}
        {book.starred && (
          <div className="absolute bottom-2 right-2">
            <Heart className="h-5 w-5 text-red-500 drop-shadow" weight="fill" />
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
          {book.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
          {book.authorDisplay}
        </p>

        {/* Description */}
        {book.description && (
          <p className="mt-1 line-clamp-2 text-[10px] text-neutral-400 dark:text-neutral-500">
            {book.description}
          </p>
        )}

        {/* Bottom info */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {/* Pages */}
          {book.pages && (
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
              {book.pages} pages
            </span>
          )}

          {/* Community rating */}
          {book.communityRating && (
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-neutral-400" weight="fill" />
              <span className="text-[10px] text-neutral-400">
                {book.communityRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Publisher/Format */}
        {(book.publisher || book.editionFormat) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {book.editionFormat && (
              <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {book.editionFormat}
              </span>
            )}
            {book.publisher && (
              <span className="line-clamp-1 rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {book.publisher}
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  )
}
