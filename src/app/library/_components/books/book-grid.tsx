'use client'

import { BookEntry } from './types'
import { BookCard } from './book-card'

interface BookGridProps {
  books: BookEntry[]
}

export function BookGrid({ books }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {books.map(book => (
        <BookCard key={book.bookId} book={book} />
      ))}
    </div>
  )
}
