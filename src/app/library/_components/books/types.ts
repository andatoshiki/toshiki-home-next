// Types for Hardcover books data

export interface HardcoverProfile {
  userId: number
  username: string
  name?: string
  bio?: string
  avatarUrl?: string
  profileUrl: string
  location?: string
  link?: string
  booksCount: number
  followersCount: number
  followingCount: number
  createdAt: string
  // Status counts
  wantToReadCount: number
  currentlyReadingCount: number
  readCount: number
  didNotFinishCount: number
  ownedCount: number
  // Stats
  averageRating?: number
  totalPagesRead: number
  lastUpdated: number
}

export interface BookEntry {
  // Book identification
  bookId: number
  userBookId: number
  title: string
  subtitle?: string
  slug?: string
  description?: string

  // Authors
  authors: string[]
  authorDisplay: string

  // Images
  coverImage?: string

  // Book details
  pages?: number
  releaseDate?: string
  releaseYear?: number

  // User status
  status: string
  statusDisplay: string
  rating?: number
  ratingFormatted: string | null
  dateAdded: string
  firstReadDate?: string
  lastReadDate?: string
  readCount: number
  owned: boolean
  starred: boolean
  review?: string

  // Community stats
  communityRating?: number
  ratingsCount: number
  reviewsCount: number

  // Series info
  seriesName?: string
  seriesPosition?: number

  // Edition info
  editionId?: number
  editionFormat?: string
  isbn10?: string
  isbn13?: string
  publisher?: string

  // URLs
  hardcoverUrl: string
  updatedAt: string

  // Custom fields
  customNote?: string
  customTags: string[]
  featured: boolean
  hidden: boolean

  // Computed fields
  hasRating: boolean
  isRead: boolean
  isCurrentlyReading: boolean
  isWantToRead: boolean
}

export type BookStatusFilter =
  | 'ALL'
  | 'WANT_TO_READ'
  | 'CURRENTLY_READING'
  | 'READ'
  | 'DID_NOT_FINISH'
  | 'OWNED'

export type BookSortOption =
  | 'recent'
  | 'rating'
  | 'title'
  | 'dateAdded'
  | 'pages'
  | 'communityRating'
