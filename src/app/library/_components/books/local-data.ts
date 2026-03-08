// Load local books data from Velite collections

import { booksList, hardcoverProfile } from '#content'
import { BookEntry, HardcoverProfile } from './types'

export function getLocalBooksList(): BookEntry[] {
  try {
    // Filter out hidden books and sort by most recently updated
    return (booksList as BookEntry[])
      .filter(book => !book.hidden)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
  } catch {
    console.warn(
      'No local books data found. Run `npx tsx tools/sync-hardcover.ts` to sync.'
    )
    return []
  }
}

export function getLocalHardcoverProfile(): HardcoverProfile | null {
  try {
    return hardcoverProfile as HardcoverProfile
  } catch {
    console.warn(
      'No local Hardcover profile found. Run `npx tsx tools/sync-hardcover.ts` to sync.'
    )
    return null
  }
}
