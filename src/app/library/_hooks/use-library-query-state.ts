'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { MediaType } from '../_components/media/media-type-tabs'
import type { StatusFilter } from '../_components/media/status-tabs'
import type {
  GameFilterOption,
  GameSortOption
} from '../_components/games/types'
import type {
  BookStatusFilter,
  BookSortOption
} from '../_components/books/types'

// ─── Constants ────────────────────────────────────────────────────────────────

export const ITEMS_PER_PAGE = 24
export const GAMES_PER_PAGE = 20
export const BOOKS_PER_PAGE = 24

export const DEFAULT_MEDIA_TYPE: MediaType = 'ANIME'
export const DEFAULT_MEDIA_STATUS: StatusFilter = 'ALL'
export const DEFAULT_GAME_FILTER: GameFilterOption = 'all'
export const DEFAULT_GAME_SORT: GameSortOption = 'playtime'
export const DEFAULT_BOOK_STATUS: BookStatusFilter = 'ALL'
export const DEFAULT_BOOK_SORT: BookSortOption = 'recent'
export const DEFAULT_PAGE = 1

const MEDIA_TYPE_PARAM_TO_VALUE: Record<string, MediaType> = {
  anime: 'ANIME',
  manga: 'MANGA',
  games: 'GAMES',
  books: 'BOOKS'
}

const MEDIA_TYPE_VALUE_TO_PARAM: Record<MediaType, string> = {
  ANIME: 'anime',
  MANGA: 'manga',
  GAMES: 'games',
  BOOKS: 'books'
}

const MEDIA_STATUS_SET = new Set<StatusFilter>([
  'ALL',
  'CURRENT',
  'COMPLETED',
  'PLANNING',
  'PAUSED',
  'DROPPED',
  'REPEATING'
])

const BOOK_STATUS_SET = new Set<BookStatusFilter>([
  'ALL',
  'WANT_TO_READ',
  'CURRENTLY_READING',
  'READ',
  'DID_NOT_FINISH',
  'OWNED'
])

const GAME_FILTER_SET = new Set<GameFilterOption>(['all', 'played', 'unplayed'])

const GAME_SORT_SET = new Set<GameSortOption>([
  'playtime',
  'recent',
  'name',
  'metacritic'
])

const BOOK_SORT_SET = new Set<BookSortOption>(['recent', 'dateAdded', 'rating'])

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LibraryQueryState {
  type: MediaType
  page: number
  mediaStatus: StatusFilter
  gameFilter: GameFilterOption
  gameSort: GameSortOption
  bookStatus: BookStatusFilter
  bookSort: BookSortOption
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

function parsePage(value: string | null): number {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_PAGE
  return parsed
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages < 1) return DEFAULT_PAGE
  return Math.min(Math.max(page, 1), totalPages)
}

function parseMediaType(value: string | null): MediaType {
  if (!value) return DEFAULT_MEDIA_TYPE
  return MEDIA_TYPE_PARAM_TO_VALUE[value.toLowerCase()] ?? DEFAULT_MEDIA_TYPE
}

function parseMediaStatus(value: string | null): StatusFilter {
  if (!value) return DEFAULT_MEDIA_STATUS
  const normalized = value.toUpperCase() as StatusFilter
  return MEDIA_STATUS_SET.has(normalized) ? normalized : DEFAULT_MEDIA_STATUS
}

function parseBookStatus(value: string | null): BookStatusFilter {
  if (!value) return DEFAULT_BOOK_STATUS
  const normalized = value.toUpperCase() as BookStatusFilter
  return BOOK_STATUS_SET.has(normalized) ? normalized : DEFAULT_BOOK_STATUS
}

function parseGameFilter(value: string | null): GameFilterOption {
  if (!value) return DEFAULT_GAME_FILTER
  return GAME_FILTER_SET.has(value as GameFilterOption)
    ? (value as GameFilterOption)
    : DEFAULT_GAME_FILTER
}

function parseGameSort(value: string | null): GameSortOption {
  if (!value) return DEFAULT_GAME_SORT
  return GAME_SORT_SET.has(value as GameSortOption)
    ? (value as GameSortOption)
    : DEFAULT_GAME_SORT
}

function parseBookSort(value: string | null): BookSortOption {
  if (!value) return DEFAULT_BOOK_SORT
  return BOOK_SORT_SET.has(value as BookSortOption)
    ? (value as BookSortOption)
    : DEFAULT_BOOK_SORT
}

function buildLibrarySearchParams(state: LibraryQueryState): URLSearchParams {
  const params = new URLSearchParams()

  params.set('type', MEDIA_TYPE_VALUE_TO_PARAM[state.type])
  params.set('page', String(state.page))

  if (state.type === 'ANIME' || state.type === 'MANGA') {
    if (state.mediaStatus !== DEFAULT_MEDIA_STATUS) {
      params.set('status', state.mediaStatus.toLowerCase())
    }
    return params
  }

  if (state.type === 'GAMES') {
    if (state.gameFilter !== DEFAULT_GAME_FILTER) {
      params.set('filter', state.gameFilter)
    }
    if (state.gameSort !== DEFAULT_GAME_SORT) {
      params.set('sort', state.gameSort)
    }
    return params
  }

  if (state.bookStatus !== DEFAULT_BOOK_STATUS) {
    params.set('status', state.bookStatus.toLowerCase())
  }
  if (state.bookSort !== DEFAULT_BOOK_SORT) {
    params.set('sort', state.bookSort)
  }

  return params
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLibraryQueryState() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()

  const queryState = useMemo<LibraryQueryState>(() => {
    const params = new URLSearchParams(searchParamsString)
    return {
      type: parseMediaType(params.get('type')),
      page: parsePage(params.get('page')),
      mediaStatus: parseMediaStatus(params.get('status')),
      gameFilter: parseGameFilter(params.get('filter')),
      gameSort: parseGameSort(params.get('sort')),
      bookStatus: parseBookStatus(params.get('status')),
      bookSort: parseBookSort(params.get('sort'))
    }
  }, [searchParamsString])

  const updateQueryState = useCallback(
    (partialState: Partial<LibraryQueryState>) => {
      const nextState: LibraryQueryState = { ...queryState, ...partialState }
      const nextSearchParams = buildLibrarySearchParams(nextState).toString()
      if (nextSearchParams === searchParamsString) return
      router.replace(`${pathname}?${nextSearchParams}`, { scroll: false })
    },
    [pathname, queryState, router, searchParamsString]
  )

  const handleMediaTypeChange = useCallback(
    (type: MediaType) => {
      if (type === 'ANIME' || type === 'MANGA') {
        updateQueryState({
          type,
          mediaStatus: DEFAULT_MEDIA_STATUS,
          page: DEFAULT_PAGE
        })
        return
      }
      if (type === 'GAMES') {
        updateQueryState({
          type,
          gameFilter: DEFAULT_GAME_FILTER,
          gameSort: DEFAULT_GAME_SORT,
          page: DEFAULT_PAGE
        })
        return
      }
      updateQueryState({
        type,
        bookStatus: DEFAULT_BOOK_STATUS,
        bookSort: DEFAULT_BOOK_SORT,
        page: DEFAULT_PAGE
      })
    },
    [updateQueryState]
  )

  const handleMediaStatusChange = useCallback(
    (status: StatusFilter) =>
      updateQueryState({ mediaStatus: status, page: DEFAULT_PAGE }),
    [updateQueryState]
  )

  const handleGameFilterChange = useCallback(
    (filter: GameFilterOption) =>
      updateQueryState({ gameFilter: filter, page: DEFAULT_PAGE }),
    [updateQueryState]
  )

  const handleGameSortChange = useCallback(
    (sort: GameSortOption) =>
      updateQueryState({ gameSort: sort, page: DEFAULT_PAGE }),
    [updateQueryState]
  )

  const handleBookStatusChange = useCallback(
    (status: BookStatusFilter) =>
      updateQueryState({ bookStatus: status, page: DEFAULT_PAGE }),
    [updateQueryState]
  )

  const handleBookSortChange = useCallback(
    (sort: BookSortOption) =>
      updateQueryState({ bookSort: sort, page: DEFAULT_PAGE }),
    [updateQueryState]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updateQueryState({ page: Math.max(DEFAULT_PAGE, page) })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [updateQueryState]
  )

  const ensureValidPage = useCallback(
    (totalPages: number) => {
      const canonicalPage = clampPage(queryState.page, totalPages)
      updateQueryState({ page: canonicalPage })
    },
    [queryState.page, updateQueryState]
  )

  return {
    activeMediaType: queryState.type,
    currentPage: queryState.page,
    activeStatus: queryState.mediaStatus,
    activeFilter: queryState.gameFilter,
    activeSort: queryState.gameSort,
    activeBookStatus: queryState.bookStatus,
    activeBookSort: queryState.bookSort,
    handleMediaTypeChange,
    handleMediaStatusChange,
    handleGameFilterChange,
    handleGameSortChange,
    handleBookStatusChange,
    handleBookSortChange,
    handlePageChange,
    ensureValidPage
  }
}
