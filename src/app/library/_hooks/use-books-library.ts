'use client'

import { useMemo } from 'react'
import type {
  BookStatusFilter,
  BookSortOption
} from '../_components/books/types'
import { getLocalBooksList } from '../_components/books/local-data'
import { clampPage, BOOKS_PER_PAGE } from './use-library-query-state'

const books = getLocalBooksList()

export function useBooksLibrary(
  currentPage: number,
  activeStatus: BookStatusFilter,
  activeSort: BookSortOption
) {
  const bookStatusCounts = useMemo(
    () => ({
      all: books.length,
      wantToRead: books.filter(b => b.status === 'WANT_TO_READ').length,
      currentlyReading: books.filter(b => b.status === 'CURRENTLY_READING')
        .length,
      read: books.filter(b => b.status === 'READ').length,
      didNotFinish: books.filter(b => b.status === 'DID_NOT_FINISH').length,
      owned: books.filter(b => b.status === 'OWNED').length
    }),
    [books]
  )

  const filteredBooks = useMemo(() => {
    let filtered =
      activeStatus === 'ALL'
        ? [...books]
        : books.filter(b => b.status === activeStatus)

    switch (activeSort) {
      case 'recent':
        filtered.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        break
      case 'dateAdded':
        filtered.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        )
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
    }

    return filtered
  }, [books, activeStatus, activeSort])

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)
  const page = clampPage(currentPage, totalPages)

  const paginatedBooks = useMemo(() => {
    const start = (page - 1) * BOOKS_PER_PAGE
    return filteredBooks.slice(start, start + BOOKS_PER_PAGE)
  }, [filteredBooks, page])

  return {
    books,
    bookStatusCounts,
    filteredBooks,
    paginatedBooks,
    totalPages,
    currentPage: page
  }
}
