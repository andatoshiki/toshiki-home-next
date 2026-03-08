'use client'

import { MediaListEntry } from './types'
import { MediaCard } from './media-card'

interface MediaGridProps {
  entries: MediaListEntry[]
}

export function MediaGrid({ entries }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {entries.map(entry => (
        <MediaCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
