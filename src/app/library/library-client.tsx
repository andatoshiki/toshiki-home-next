'use client'

import { useEffect } from 'react'
import { Title } from '~/components/title'
import {
  BookGrid,
  BookSortTabs,
  BookStatusTabs,
  GameFilterTabs,
  GameGrid,
  GameSortTabs,
  LoadingSkeleton,
  MediaGrid,
  MediaTypeTabs,
  Pagination,
  StatusTabs,
  SteamProfileCard
} from './_components'
import { useBooksLibrary } from './_hooks/use-books-library'
import { useGamesLibrary } from './_hooks/use-games-library'
import { useLibraryQueryState } from './_hooks/use-library-query-state'
import { useMediaLibrary } from './_hooks/use-media-library'

export default function LibraryClient() {
  const {
    activeMediaType,
    currentPage,
    activeStatus,
    activeFilter,
    activeSort,
    activeBookStatus,
    activeBookSort,
    handleMediaTypeChange,
    handleMediaStatusChange,
    handleGameFilterChange,
    handleGameSortChange,
    handleBookStatusChange,
    handleBookSortChange,
    handlePageChange,
    ensureValidPage
  } = useLibraryQueryState()

  const mediaLibrary = useMediaLibrary(
    activeMediaType,
    currentPage,
    activeStatus
  )
  const gamesLibrary = useGamesLibrary(currentPage, activeFilter, activeSort)
  const booksLibrary = useBooksLibrary(
    currentPage,
    activeBookStatus,
    activeBookSort
  )

  const isGames = activeMediaType === 'GAMES'
  const isBooks = activeMediaType === 'BOOKS'
  const isMedia = !isGames && !isBooks

  const activeTotalPages = isGames
    ? gamesLibrary.totalPages
    : isBooks
      ? booksLibrary.totalPages
      : mediaLibrary.totalPages
  const canCanonicalizePage = isGames
    ? !gamesLibrary.loading && !gamesLibrary.error
    : isBooks
      ? !booksLibrary.loading && !booksLibrary.error
      : !mediaLibrary.loading && !mediaLibrary.error

  useEffect(() => {
    if (!canCanonicalizePage) return
    ensureValidPage(activeTotalPages)
  }, [activeTotalPages, canCanonicalizePage, ensureValidPage])

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

      {isMedia && (
        <>
          {mediaLibrary.loading && <LoadingSkeleton count={18} />}

          {mediaLibrary.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              <p>{mediaLibrary.error}</p>
            </div>
          )}

          {!mediaLibrary.loading &&
            !mediaLibrary.error &&
            mediaLibrary.entries.length === 0 && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <p>No {activeMediaType.toLowerCase()} found in the list.</p>
              </div>
            )}

          {!mediaLibrary.loading &&
            !mediaLibrary.error &&
            mediaLibrary.entries.length > 0 && (
              <>
                <StatusTabs
                  activeStatus={activeStatus}
                  onStatusChange={handleMediaStatusChange}
                  counts={mediaLibrary.statusCounts}
                  mediaType={activeMediaType}
                />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {mediaLibrary.filteredEntries.length}{' '}
                  {activeMediaType.toLowerCase()}
                  {activeStatus !== 'ALL' &&
                    ` in ${activeStatus.toLowerCase()}`}
                  {mediaLibrary.totalPages > 1 &&
                    ` • Page ${mediaLibrary.currentPage} of ${mediaLibrary.totalPages}`}
                </p>
                <MediaGrid entries={mediaLibrary.paginatedEntries} />
                <Pagination
                  currentPage={mediaLibrary.currentPage}
                  totalPages={mediaLibrary.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
        </>
      )}

      {isGames && (
        <>
          {gamesLibrary.profile && (
            <SteamProfileCard profile={gamesLibrary.profile} />
          )}

          {gamesLibrary.loading && <LoadingSkeleton count={12} />}

          {gamesLibrary.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              <p>{gamesLibrary.error}</p>
            </div>
          )}

          {!gamesLibrary.loading &&
            !gamesLibrary.error &&
            gamesLibrary.games.length > 0 && (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <GameFilterTabs
                    activeFilter={activeFilter}
                    onFilterChange={handleGameFilterChange}
                    counts={gamesLibrary.filterCounts}
                  />
                  <GameSortTabs
                    activeSort={activeSort}
                    onSortChange={handleGameSortChange}
                  />
                </div>

                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {gamesLibrary.filteredGames.length} games
                  {activeFilter !== 'all' && ` (${activeFilter})`}
                  {gamesLibrary.totalPages > 1 &&
                    ` • Page ${gamesLibrary.currentPage} of ${gamesLibrary.totalPages}`}
                </p>

                <GameGrid games={gamesLibrary.paginatedGames} />

                <Pagination
                  currentPage={gamesLibrary.currentPage}
                  totalPages={gamesLibrary.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}

          {!gamesLibrary.loading &&
            !gamesLibrary.error &&
            gamesLibrary.games.length === 0 && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <p>No games found. Sync your Steam library to get started.</p>
              </div>
            )}
        </>
      )}

      {isBooks && (
        <>
          {booksLibrary.loading && <LoadingSkeleton count={18} />}

          {booksLibrary.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              <p>{booksLibrary.error}</p>
            </div>
          )}

          {!booksLibrary.loading &&
            !booksLibrary.error &&
            booksLibrary.books.length > 0 && (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <BookStatusTabs
                    activeStatus={activeBookStatus}
                    onStatusChange={handleBookStatusChange}
                    counts={booksLibrary.bookStatusCounts}
                  />
                  <BookSortTabs
                    activeSort={activeBookSort}
                    onSortChange={handleBookSortChange}
                  />
                </div>

                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {booksLibrary.filteredBooks.length} books
                  {activeBookStatus !== 'ALL' &&
                    ` (${activeBookStatus.toLowerCase().replace(/_/g, ' ')})`}
                  {booksLibrary.totalPages > 1 &&
                    ` • Page ${booksLibrary.currentPage} of ${booksLibrary.totalPages}`}
                </p>

                <BookGrid books={booksLibrary.paginatedBooks} />

                <Pagination
                  currentPage={booksLibrary.currentPage}
                  totalPages={booksLibrary.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}

          {!booksLibrary.loading &&
            !booksLibrary.error &&
            booksLibrary.books.length === 0 && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <p>
                  No books found. Sync your Hardcover library to get started.
                </p>
              </div>
            )}
        </>
      )}
    </div>
  )
}
