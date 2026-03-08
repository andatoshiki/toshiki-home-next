import React from 'react'
import { cn } from '~/lib/utils/style'

export interface RepositoryCardProps {
  name: string
  language?: string | null
  stars: number
  top?: boolean
  license?: string | null
  description: string
  htmlUrl: string
}

export function RepositoryCard({
  name,
  language,
  stars,
  top = false,
  license,
  description,
  htmlUrl
}: RepositoryCardProps) {
  return (
    <a
      href={htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900',
        top && 'ring-2 ring-yellow-400/60'
      )}
    >
      <div
        className={cn('mb-2 flex items-center justify-between', top && 'mb-4')}
      >
        <h3 className="flex items-center gap-1 truncate text-base font-semibold text-black/90 dark:text-white/90">
          <span className="text-black/50 dark:text-white/30">
            @andatoshiki/
          </span>
          <span>{name}</span>
        </h3>
        {top && (
          <svg
            className="h-6 w-6 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <title>Top repository</title>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        )}
      </div>
      <p className="mb-4 line-clamp-2 text-black/50 dark:text-white/30">
        {description}
      </p>
      <div className="mt-auto space-y-1">
        <div className="flex items-center justify-between text-black/50 dark:text-white/30">
          <span>Stars:</span>
          <span>{stars}</span>
        </div>
        <div className="flex items-center justify-between text-black/50 dark:text-white/30">
          <span>Language:</span>
          <span>{language || '-'}</span>
        </div>
        {license && (
          <div className="flex items-center justify-between text-black/50 dark:text-white/30">
            <span>License:</span>
            <span>{license}</span>
          </div>
        )}
      </div>
    </a>
  )
}
