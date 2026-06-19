'use client'

import { useState, useEffect, useMemo } from 'react'
import type {
  BookEntry,
  HardcoverProfile,
  BookStatusFilter,
  BookSortOption
} from '../_components/books/types'
import {
  getLocalBooksList,
  getLocalHardcoverProfile
} from '../_components/books/local-data'
import { clampPage, BOOKS_PER_PAGE } from './use-library-query-state'

export function useBooksLibrary(
  currentPage: number,
  activeStatus: BookStatusFilter,
  activeSort: BookSortOption
) {
  const [books, setBooks] = useState<BookEntry[]>([])
  const [bookProfile, setBookProfile] = useState<HardcoverProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const localBooks = getLocalBooksList()
      const localProfile = getLocalHardcoverProfile()
      setBooks(localBooks)
      setBookProfile(localProfile)
      setLoading(false)
      if (localBooks.length === 0) {
        setError(
          "No local books data found. Run 'npx tsx tools/sync-hardcover.ts' to sync."
        )
      }
    } catch {
      setError('Failed to load local books data')
      setLoading(false)
    }
  }, [])

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
      case 'communityRating':
        filtered.sort(
          (a, b) => (b.communityRating ?? 0) - (a.communityRating ?? 0)
        )
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'pages':
        filtered.sort((a, b) => (b.pages ?? 0) - (a.pages ?? 0))
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
    bookProfile,
    loading,
    error,
    bookStatusCounts,
    filteredBooks,
    paginatedBooks,
    totalPages,
    currentPage: page
  }
}
