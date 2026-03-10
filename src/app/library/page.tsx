'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Title } from '~/components/title'
import {
  MediaGrid,
  LoadingSkeleton,
  MediaListEntry,
  AniListResponse,
  StatusTabs,
  StatusFilter,
  MediaTypeTabs,
  MediaType,
  Pagination,
  getLocalMediaList,
  // Games
  GameEntry,
  SteamProfile,
  GameGrid,
  SteamProfileCard,
  GameSortTabs,
  GameFilterTabs,
  GameSortOption,
  GameFilterOption,
  getLocalGamesList,
  getLocalSteamProfile,
  // Books
  BookEntry,
  HardcoverProfile,
  BookGrid,
  BookSortTabs,
  BookStatusTabs,
  BookSortOption,
  BookStatusFilter,
  getLocalBooksList,
  getLocalHardcoverProfile
} from './_components'

// Configuration flags
const ANIME_DATA_IS_LOCAL = true
const GAMES_DATA_IS_LOCAL = true
const BOOKS_DATA_IS_LOCAL = true

const ANILIST_ENDPOINT = 'https://graphql.anilist.co'
const ITEMS_PER_PAGE = 24
const GAMES_PER_PAGE = 20
const BOOKS_PER_PAGE = 24

const DEFAULT_MEDIA_TYPE: MediaType = 'ANIME'
const DEFAULT_MEDIA_STATUS: StatusFilter = 'ALL'
const DEFAULT_GAME_FILTER: GameFilterOption = 'all'
const DEFAULT_GAME_SORT: GameSortOption = 'playtime'
const DEFAULT_BOOK_STATUS: BookStatusFilter = 'ALL'
const DEFAULT_BOOK_SORT: BookSortOption = 'recent'
const DEFAULT_PAGE = 1

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

// Keep sort options aligned with currently exposed UI tabs.
const BOOK_SORT_SET = new Set<BookSortOption>(['recent', 'dateAdded', 'rating'])

interface LibraryQueryState {
  type: MediaType
  page: number
  mediaStatus: StatusFilter
  gameFilter: GameFilterOption
  gameSort: GameSortOption
  bookStatus: BookStatusFilter
  bookSort: BookSortOption
}

function parsePage(value: string | null): number {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_PAGE
  return parsed
}

function clampPage(page: number, totalPages: number): number {
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

const MEDIA_LIST_QUERY = `
  query ($userName: String!, $type: MediaType!) {
    MediaListCollection(userName: $userName, type: $type) {
      lists {
        name
        entries {
          id
          status
          score(format: POINT_10_DECIMAL)
          progress
          updatedAt
          createdAt
          media {
            id
            title {
              romaji
              english
              native
              userPreferred
            }
            description(asHtml: false)
            coverImage {
              extraLarge
              large
              medium
              color
            }
            episodes
            chapters
            volumes
            format
            status
            siteUrl
          }
        }
      }
    }
  }
`

async function fetchMediaList(
  username: string,
  type: 'ANIME' | 'MANGA'
): Promise<MediaListEntry[]> {
  const response = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: MEDIA_LIST_QUERY,
      variables: {
        userName: username,
        type: type
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${type.toLowerCase()} list`)
  }

  const json: AniListResponse = await response.json()

  // Flatten all entries from all lists
  const allEntries = json.data.MediaListCollection.lists.flatMap(
    list => list.entries
  )

  // Sort by updatedAt in descending order (most recent first)
  return allEntries.sort((a, b) => b.updatedAt - a.updatedAt)
}

export default function LibraryPage() {
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

  const activeMediaType = queryState.type
  const activeStatus = queryState.mediaStatus
  const activeFilter = queryState.gameFilter
  const activeSort = queryState.gameSort
  const activeBookStatus = queryState.bookStatus
  const activeBookSort = queryState.bookSort
  const currentPage = queryState.page

  // Media state
  const [entries, setEntries] = useState<MediaListEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Games state
  const [games, setGames] = useState<GameEntry[]>([])
  const [profile, setProfile] = useState<SteamProfile | null>(null)
  const [gamesLoading, setGamesLoading] = useState(true)
  const [gamesError, setGamesError] = useState<string | null>(null)

  // Books state
  const [books, setBooks] = useState<BookEntry[]>([])
  const [bookProfile, setBookProfile] = useState<HardcoverProfile | null>(null)
  const [booksLoading, setBooksLoading] = useState(true)
  const [booksError, setBooksError] = useState<string | null>(null)

  const username = process.env.NEXT_PUBLIC_ANILIST_USERNAME

  // Media computed values
  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      ALL: entries.length,
      CURRENT: 0,
      COMPLETED: 0,
      PLANNING: 0,
      PAUSED: 0,
      DROPPED: 0,
      REPEATING: 0
    }
    entries.forEach(entry => {
      counts[entry.status]++
    })
    return counts
  }, [entries])

  const filteredEntries = useMemo(() => {
    if (activeStatus === 'ALL') return entries
    return entries.filter(entry => entry.status === activeStatus)
  }, [entries, activeStatus])

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE)
  const mediaPage = useMemo(
    () => clampPage(currentPage, totalPages),
    [currentPage, totalPages]
  )
  const paginatedEntries = useMemo(() => {
    const startIndex = (mediaPage - 1) * ITEMS_PER_PAGE
    return filteredEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredEntries, mediaPage])

  // Games computed values
  const filterCounts = useMemo(() => {
    return {
      all: games.length,
      played: games.filter(g => g.hasPlaytime).length,
      unplayed: games.filter(g => !g.hasPlaytime).length
    }
  }, [games])

  const filteredGames = useMemo(() => {
    let filtered = [...games]

    if (activeFilter === 'played') {
      filtered = filtered.filter(g => g.hasPlaytime)
    } else if (activeFilter === 'unplayed') {
      filtered = filtered.filter(g => !g.hasPlaytime)
    }

    switch (activeSort) {
      case 'playtime':
        filtered.sort((a, b) => b.playtimeMinutes - a.playtimeMinutes)
        break
      case 'recent':
        filtered.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'metacritic':
        filtered.sort(
          (a, b) => (b.metacriticScore || 0) - (a.metacriticScore || 0)
        )
        break
    }

    return filtered
  }, [games, activeFilter, activeSort])

  const gamesTotalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE)
  const gamesPage = useMemo(
    () => clampPage(currentPage, gamesTotalPages),
    [currentPage, gamesTotalPages]
  )
  const paginatedGames = useMemo(() => {
    const startIndex = (gamesPage - 1) * GAMES_PER_PAGE
    return filteredGames.slice(startIndex, startIndex + GAMES_PER_PAGE)
  }, [filteredGames, gamesPage])

  // Books computed values
  const bookStatusCounts = useMemo(() => {
    return {
      all: books.length,
      wantToRead: books.filter(b => b.status === 'WANT_TO_READ').length,
      currentlyReading: books.filter(b => b.status === 'CURRENTLY_READING')
        .length,
      read: books.filter(b => b.status === 'READ').length,
      didNotFinish: books.filter(b => b.status === 'DID_NOT_FINISH').length,
      owned: books.filter(b => b.status === 'OWNED').length
    }
  }, [books])

  const filteredBooks = useMemo(() => {
    let filtered = [...books]

    // Filter by status
    if (activeBookStatus !== 'ALL') {
      filtered = filtered.filter(b => b.status === activeBookStatus)
    }

    // Sort
    switch (activeBookSort) {
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
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'communityRating':
        filtered.sort(
          (a, b) => (b.communityRating || 0) - (a.communityRating || 0)
        )
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'pages':
        filtered.sort((a, b) => (b.pages || 0) - (a.pages || 0))
        break
    }

    return filtered
  }, [books, activeBookStatus, activeBookSort])

  const booksTotalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)
  const booksPage = useMemo(
    () => clampPage(currentPage, booksTotalPages),
    [currentPage, booksTotalPages]
  )
  const paginatedBooks = useMemo(() => {
    const startIndex = (booksPage - 1) * BOOKS_PER_PAGE
    return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE)
  }, [filteredBooks, booksPage])

  const activeTotalPages = useMemo(() => {
    if (activeMediaType === 'GAMES') return gamesTotalPages
    if (activeMediaType === 'BOOKS') return booksTotalPages
    return totalPages
  }, [activeMediaType, gamesTotalPages, booksTotalPages, totalPages])

  const shouldClampActivePage = useMemo(() => {
    if (activeMediaType === 'GAMES') return !gamesLoading && !gamesError
    if (activeMediaType === 'BOOKS') return !booksLoading && !booksError
    return !loading && !error
  }, [
    activeMediaType,
    booksError,
    booksLoading,
    error,
    gamesError,
    gamesLoading,
    loading
  ])

  const canonicalPage = useMemo(() => {
    if (!shouldClampActivePage) return queryState.page
    return clampPage(queryState.page, activeTotalPages)
  }, [activeTotalPages, queryState.page, shouldClampActivePage])

  const canonicalState = useMemo<LibraryQueryState>(
    () => ({
      ...queryState,
      page: canonicalPage
    }),
    [canonicalPage, queryState]
  )

  const canonicalSearchParams = useMemo(
    () => buildLibrarySearchParams(canonicalState).toString(),
    [canonicalState]
  )

  const updateQueryState = useCallback(
    (partialState: Partial<LibraryQueryState>) => {
      const nextState: LibraryQueryState = {
        ...queryState,
        ...partialState
      }

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
    (status: StatusFilter) => {
      updateQueryState({
        mediaStatus: status,
        page: DEFAULT_PAGE
      })
    },
    [updateQueryState]
  )

  const handleGameFilterChange = useCallback(
    (filter: GameFilterOption) => {
      updateQueryState({
        gameFilter: filter,
        page: DEFAULT_PAGE
      })
    },
    [updateQueryState]
  )

  const handleGameSortChange = useCallback(
    (sort: GameSortOption) => {
      updateQueryState({
        gameSort: sort,
        page: DEFAULT_PAGE
      })
    },
    [updateQueryState]
  )

  const handleBookStatusChange = useCallback(
    (status: BookStatusFilter) => {
      updateQueryState({
        bookStatus: status,
        page: DEFAULT_PAGE
      })
    },
    [updateQueryState]
  )

  const handleBookSortChange = useCallback(
    (sort: BookSortOption) => {
      updateQueryState({
        bookSort: sort,
        page: DEFAULT_PAGE
      })
    },
    [updateQueryState]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updateQueryState({ page: Math.max(DEFAULT_PAGE, page) })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [updateQueryState]
  )

  useEffect(() => {
    if (canonicalSearchParams === searchParamsString) return
    router.replace(`${pathname}?${canonicalSearchParams}`, { scroll: false })
  }, [canonicalSearchParams, pathname, router, searchParamsString])

  // Fetch media data
  useEffect(() => {
    if (activeMediaType === 'GAMES' || activeMediaType === 'BOOKS') return

    if (ANIME_DATA_IS_LOCAL) {
      try {
        const localData = getLocalMediaList(activeMediaType)
        setEntries(localData)
        setLoading(false)
        setError(
          localData.length === 0
            ? `No local ${activeMediaType.toLowerCase()} data found. Run 'npx tsx tools/sync-anilist.ts --${activeMediaType.toLowerCase()}' to sync.`
            : null
        )
      } catch {
        setError(`Failed to load local ${activeMediaType.toLowerCase()} data`)
        setLoading(false)
      }
      return
    }

    if (!username) {
      setError(
        'AniList username not configured. Please set NEXT_PUBLIC_ANILIST_USERNAME in .env'
      )
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    fetchMediaList(username, activeMediaType)
      .then(data => {
        setEntries(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [username, activeMediaType])

  // Fetch games data
  useEffect(() => {
    if (GAMES_DATA_IS_LOCAL) {
      try {
        const localGames = getLocalGamesList()
        const localProfile = getLocalSteamProfile()
        setGames(localGames)
        setProfile(localProfile)
        setGamesLoading(false)
        if (localGames.length === 0) {
          setGamesError(
            "No local games data found. Run 'npx tsx tools/sync-steam.ts' to sync."
          )
        }
      } catch {
        setGamesError('Failed to load local games data')
        setGamesLoading(false)
      }
    } else {
      setGamesError('Steam API fetching not implemented. Use local data mode.')
      setGamesLoading(false)
    }
  }, [])

  // Fetch books data
  useEffect(() => {
    if (BOOKS_DATA_IS_LOCAL) {
      try {
        const localBooks = getLocalBooksList()
        const localProfile = getLocalHardcoverProfile()
        setBooks(localBooks)
        setBookProfile(localProfile)
        setBooksLoading(false)
        if (localBooks.length === 0) {
          setBooksError(
            "No local books data found. Run 'npx tsx tools/sync-hardcover.ts' to sync."
          )
        }
      } catch {
        setBooksError('Failed to load local books data')
        setBooksLoading(false)
      }
    } else {
      setBooksError(
        'Hardcover API fetching not implemented. Use local data mode.'
      )
      setBooksLoading(false)
    }
  }, [])

  const isGames = activeMediaType === 'GAMES'
  const isBooks = activeMediaType === 'BOOKS'
  const isMedia = !isGames && !isBooks

  return (
    <div className="content-vertical-spaces content-container m-auto space-y-6 md:space-y-4">
      <div>
        <Title text="Library" />
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {isGames
            ? "My Steam games library. See what I've been playing, total hours invested, and discover my gaming preferences."
            : isBooks
              ? "My reading collection synced from Hardcover. Browse through what I've read, am currently reading, and what's on my to-read list."
              : "My personal anime & manga collection synced from AniList. Browse through what I've watched, read, currently enjoying, and planning to explore."}
        </p>
      </div>

      <MediaTypeTabs
        activeType={activeMediaType}
        onTypeChange={handleMediaTypeChange}
      />

      {/* Media Content (Anime/Manga) */}
      {isMedia && (
        <>
          {loading && <LoadingSkeleton count={18} />}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <p>No {activeMediaType.toLowerCase()} found in the list.</p>
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <>
              <StatusTabs
                activeStatus={activeStatus}
                onStatusChange={handleMediaStatusChange}
                counts={statusCounts}
                mediaType={activeMediaType}
              />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {filteredEntries.length} {activeMediaType.toLowerCase()}
                {activeStatus !== 'ALL' && ` in ${activeStatus.toLowerCase()}`}
                {totalPages > 1 && ` • Page ${mediaPage} of ${totalPages}`}
              </p>
              <MediaGrid entries={paginatedEntries} />
              <Pagination
                currentPage={mediaPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}

      {/* Games Content */}
      {isGames && (
        <>
          {profile && <SteamProfileCard profile={profile} />}

          {gamesLoading && <LoadingSkeleton count={12} />}

          {gamesError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              <p>{gamesError}</p>
            </div>
          )}

          {!gamesLoading && !gamesError && games.length > 0 && (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <GameFilterTabs
                  activeFilter={activeFilter}
                  onFilterChange={handleGameFilterChange}
                  counts={filterCounts}
                />
                <GameSortTabs
                  activeSort={activeSort}
                  onSortChange={handleGameSortChange}
                />
              </div>

              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {filteredGames.length} games
                {activeFilter !== 'all' && ` (${activeFilter})`}
                {gamesTotalPages > 1 &&
                  ` • Page ${gamesPage} of ${gamesTotalPages}`}
              </p>

              <GameGrid games={paginatedGames} />

              <Pagination
                currentPage={gamesPage}
                totalPages={gamesTotalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {!gamesLoading && !gamesError && games.length === 0 && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <p>No games found. Sync your Steam library to get started.</p>
            </div>
          )}
        </>
      )}

      {/* Books Content */}
      {isBooks && (
        <>
          {booksLoading && <LoadingSkeleton count={18} />}

          {booksError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              <p>{booksError}</p>
            </div>
          )}

          {!booksLoading && !booksError && books.length > 0 && (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <BookStatusTabs
                  activeStatus={activeBookStatus}
                  onStatusChange={handleBookStatusChange}
                  counts={bookStatusCounts}
                />
                <BookSortTabs
                  activeSort={activeBookSort}
                  onSortChange={handleBookSortChange}
                />
              </div>

              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {filteredBooks.length} books
                {activeBookStatus !== 'ALL' &&
                  ` (${activeBookStatus.toLowerCase().replace(/_/g, ' ')})`}
                {booksTotalPages > 1 &&
                  ` • Page ${booksPage} of ${booksTotalPages}`}
              </p>

              <BookGrid books={paginatedBooks} />

              <Pagination
                currentPage={booksPage}
                totalPages={booksTotalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {!booksLoading && !booksError && books.length === 0 && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <p>No books found. Sync your Hardcover library to get started.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
