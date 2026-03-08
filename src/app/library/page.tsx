'use client'

import { useState, useEffect, useMemo } from 'react'
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
  // Media state
  const [entries, setEntries] = useState<MediaListEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('ALL')
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('ANIME')
  const [currentPage, setCurrentPage] = useState(1)

  // Games state
  const [games, setGames] = useState<GameEntry[]>([])
  const [profile, setProfile] = useState<SteamProfile | null>(null)
  const [gamesLoading, setGamesLoading] = useState(true)
  const [gamesError, setGamesError] = useState<string | null>(null)
  const [activeSort, setActiveSort] = useState<GameSortOption>('playtime')
  const [activeFilter, setActiveFilter] = useState<GameFilterOption>('all')
  const [gamesPage, setGamesPage] = useState(1)

  // Books state
  const [books, setBooks] = useState<BookEntry[]>([])
  const [bookProfile, setBookProfile] = useState<HardcoverProfile | null>(null)
  const [booksLoading, setBooksLoading] = useState(true)
  const [booksError, setBooksError] = useState<string | null>(null)
  const [activeBookSort, setActiveBookSort] = useState<BookSortOption>('recent')
  const [activeBookStatus, setActiveBookStatus] =
    useState<BookStatusFilter>('ALL')
  const [booksPage, setBooksPage] = useState(1)

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
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredEntries, currentPage])

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
  const paginatedBooks = useMemo(() => {
    const startIndex = (booksPage - 1) * BOOKS_PER_PAGE
    return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE)
  }, [filteredBooks, booksPage])

  // Reset pages on filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeStatus, activeMediaType])

  useEffect(() => {
    setGamesPage(1)
  }, [activeFilter, activeSort])

  useEffect(() => {
    setBooksPage(1)
  }, [activeBookStatus, activeBookSort])

  const handleMediaTypeChange = (type: MediaType) => {
    setActiveMediaType(type)
    setActiveStatus('ALL')
    setActiveBookStatus('ALL')
    setCurrentPage(1)
    setGamesPage(1)
    setBooksPage(1)
  }

  const handlePageChange = (page: number) => {
    if (activeMediaType === 'GAMES') {
      setGamesPage(page)
    } else if (activeMediaType === 'BOOKS') {
      setBooksPage(page)
    } else {
      setCurrentPage(page)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
                onStatusChange={setActiveStatus}
                counts={statusCounts}
                mediaType={activeMediaType}
              />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {filteredEntries.length} {activeMediaType.toLowerCase()}
                {activeStatus !== 'ALL' && ` in ${activeStatus.toLowerCase()}`}
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
              <MediaGrid entries={paginatedEntries} />
              <Pagination
                currentPage={currentPage}
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
                  onFilterChange={setActiveFilter}
                  counts={filterCounts}
                />
                <GameSortTabs
                  activeSort={activeSort}
                  onSortChange={setActiveSort}
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
                  onStatusChange={setActiveBookStatus}
                  counts={bookStatusCounts}
                />
                <BookSortTabs
                  activeSort={activeBookSort}
                  onSortChange={setActiveBookSort}
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
