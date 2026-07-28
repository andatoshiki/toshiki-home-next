// Load local books data from Velite collections

import { booksList } from '#content'
import type { BookEntry } from './types'

export function getLocalBooksList(): BookEntry[] {
  return (booksList as BookEntry[])
    .filter(book => !book.hidden)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
}
