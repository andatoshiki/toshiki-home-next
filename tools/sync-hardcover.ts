#!/usr/bin/env npx ts-node

/**
 * Script to download Hardcover book library and profile data and convert to YAML files
 * Usage: npx tsx tools/sync-hardcover.ts [--token <api_token>] [--userid <user_id>]
 *
 * Flags:
 * - --token <api_token>: Your Hardcover API token (or set HARDCOVER_API_TOKEN env var)
 * - --userid <user_id>: Your Hardcover user ID (optional, fetched from API if not provided)
 *
 * Examples:
 *   npx tsx tools/sync-hardcover.ts --token YOUR_TOKEN
 *   npx tsx tools/sync-hardcover.ts --token YOUR_TOKEN --userid 12345
 *
 * Get your API token from: https://hardcover.app/account/api
 */

import * as fs from 'fs'
import * as path from 'path'

const HARDCOVER_API_ENDPOINT = 'https://api.hardcover.app/v1/graphql'

// Status IDs from Hardcover
const STATUS_MAP: Record<number, string> = {
  1: 'WANT_TO_READ',
  2: 'CURRENTLY_READING',
  3: 'READ',
  4: 'DID_NOT_FINISH',
  5: 'OWNED'
}

const STATUS_DISPLAY: Record<string, string> = {
  WANT_TO_READ: 'Want to Read',
  CURRENTLY_READING: 'Currently Reading',
  READ: 'Read',
  DID_NOT_FINISH: 'Did Not Finish',
  OWNED: 'Owned'
}

// GraphQL Queries
const ME_QUERY = `
  query {
    me {
      id
      username
      name
      bio
      books_count
      followers_count
      followed_users_count
      location
      link
      image {
        url
      }
      created_at
    }
  }
`

const USER_BOOKS_QUERY = `
  query GetUserBooks($userId: Int!, $limit: Int!, $offset: Int!) {
    user_books(
      where: { user_id: { _eq: $userId } }
      limit: $limit
      offset: $offset
      order_by: { updated_at: desc }
    ) {
      id
      book_id
      status_id
      rating
      date_added
      first_read_date
      last_read_date
      read_count
      review
      owned
      starred
      private_notes
      updated_at
      book {
        id
        title
        subtitle
        slug
        description
        pages
        release_date
        release_year
        rating
        ratings_count
        reviews_count
        image {
          url
        }
        contributions(limit: 5) {
          author {
            name
          }
        }
        book_series(limit: 1) {
          series {
            name
          }
          position
        }
        cached_tags
      }
      edition {
        id
        title
        pages
        isbn_10
        isbn_13
        edition_format
        release_date
        publisher {
          name
        }
        image {
          url
        }
      }
    }
  }
`

interface HardcoverUser {
  id: number
  username: string
  name: string | null
  bio: string | null
  books_count: number
  followers_count: number
  followed_users_count: number
  location: string | null
  link: string | null
  image: { url: string } | null
  created_at: string
}

interface HardcoverAuthor {
  name: string
}

interface HardcoverContribution {
  author: HardcoverAuthor
}

interface HardcoverSeries {
  name: string
}

interface HardcoverBookSeries {
  series: HardcoverSeries
  position: number | null
}

interface HardcoverPublisher {
  name: string
}

interface HardcoverEdition {
  id: number
  title: string | null
  pages: number | null
  isbn_10: string | null
  isbn_13: string | null
  edition_format: string | null
  release_date: string | null
  publisher: HardcoverPublisher | null
  image: { url: string } | null
}

interface HardcoverBook {
  id: number
  title: string
  subtitle: string | null
  slug: string | null
  description: string | null
  pages: number | null
  release_date: string | null
  release_year: number | null
  rating: number | null
  ratings_count: number
  reviews_count: number
  image: { url: string } | null
  contributions: HardcoverContribution[]
  book_series: HardcoverBookSeries[]
  cached_tags: unknown
}

interface HardcoverUserBook {
  id: number
  book_id: number
  status_id: number
  rating: number | null
  date_added: string
  first_read_date: string | null
  last_read_date: string | null
  read_count: number
  review: string | null
  owned: boolean
  starred: boolean
  private_notes: string | null
  updated_at: string
  book: HardcoverBook
  edition: HardcoverEdition | null
}

interface ProcessedBook {
  bookId: number
  userBookId: number
  title: string
  subtitle: string | null
  slug: string | null
  description: string | null
  authors: string[]
  coverImage: string | null
  pages: number | null
  releaseDate: string | null
  releaseYear: number | null
  // User data
  status: string
  statusDisplay: string
  rating: number | null
  dateAdded: string
  firstReadDate: string | null
  lastReadDate: string | null
  readCount: number
  owned: boolean
  starred: boolean
  review: string | null
  // Book stats
  communityRating: number | null
  ratingsCount: number
  reviewsCount: number
  // Series info
  seriesName: string | null
  seriesPosition: number | null
  // Edition info
  editionId: number | null
  editionFormat: string | null
  isbn10: string | null
  isbn13: string | null
  publisher: string | null
  // URLs
  hardcoverUrl: string
  updatedAt: string
}

interface HardcoverProfile {
  userId: number
  username: string
  name: string | null
  bio: string | null
  avatarUrl: string | null
  profileUrl: string
  location: string | null
  link: string | null
  booksCount: number
  followersCount: number
  followingCount: number
  createdAt: string
  // Stats calculated from books
  wantToReadCount: number
  currentlyReadingCount: number
  readCount: number
  didNotFinishCount: number
  ownedCount: number
  averageRating: number | null
  totalPagesRead: number
  lastUpdated: number
}

async function graphqlRequest<T>(
  token: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(HARDCOVER_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      'User-Agent': 'toshiki-home-sync/1.0'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GraphQL request failed: ${response.status} ${text}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

async function getCurrentUser(token: string): Promise<HardcoverUser> {
  const data = await graphqlRequest<{ me: HardcoverUser[] }>(token, ME_QUERY)

  // Handle different response formats - Hardcover returns an array
  if (Array.isArray(data.me)) {
    if (data.me.length === 0) {
      throw new Error('No user found. Make sure your API token is valid.')
    }
    return data.me[0]
  }

  if (!data.me) {
    throw new Error('No user found. Make sure your API token is valid.')
  }

  return data.me as unknown as HardcoverUser
}

async function getUserBooks(
  token: string,
  userId: number
): Promise<HardcoverUserBook[]> {
  const allBooks: HardcoverUserBook[] = []
  const limit = 50
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const data = await graphqlRequest<{ user_books: HardcoverUserBook[] }>(
      token,
      USER_BOOKS_QUERY,
      { userId, limit, offset }
    )

    if (data.user_books.length === 0) {
      hasMore = false
    } else {
      allBooks.push(...data.user_books)
      offset += limit
      console.log(`📚 Fetched ${allBooks.length} books...`)

      // Rate limit protection
      await sleep(500)
    }
  }

  return allBooks
}

function processBook(userBook: HardcoverUserBook): ProcessedBook {
  const { book, edition } = userBook
  const status = STATUS_MAP[userBook.status_id] || 'UNKNOWN'

  // Get authors from contributions
  const authors = book.contributions.map(c => c.author.name)

  // Get series info
  const series = book.book_series[0]

  // Get cover image - prefer edition image if available
  const coverImage = edition?.image?.url || book.image?.url || null

  // Get pages - prefer edition pages if available
  const pages = edition?.pages || book.pages

  return {
    bookId: book.id,
    userBookId: userBook.id,
    title: book.title,
    subtitle: book.subtitle,
    slug: book.slug,
    description: book.description,
    authors,
    coverImage,
    pages,
    releaseDate: book.release_date,
    releaseYear: book.release_year,
    status,
    statusDisplay: STATUS_DISPLAY[status] || status,
    rating: userBook.rating,
    dateAdded: userBook.date_added,
    firstReadDate: userBook.first_read_date,
    lastReadDate: userBook.last_read_date,
    readCount: userBook.read_count,
    owned: userBook.owned,
    starred: userBook.starred,
    review: userBook.review,
    communityRating: book.rating,
    ratingsCount: book.ratings_count,
    reviewsCount: book.reviews_count,
    seriesName: series?.series.name || null,
    seriesPosition: series?.position || null,
    editionId: edition?.id || null,
    editionFormat: edition?.edition_format || null,
    isbn10: edition?.isbn_10 || null,
    isbn13: edition?.isbn_13 || null,
    publisher: edition?.publisher?.name || null,
    hardcoverUrl: book.slug
      ? `https://hardcover.app/books/${book.slug}`
      : `https://hardcover.app/books/${book.id}`,
    updatedAt: userBook.updated_at
  }
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
}

// Simple YAML serializer
function toYaml(obj: Record<string, unknown>, indent = 0): string {
  const spaces = '  '.repeat(indent)
  let yaml = ''

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      yaml += `${spaces}${key}: null\n`
    } else if (typeof value === 'string') {
      // Always quote strings to handle special chars
      const escaped = value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
      yaml += `${spaces}${key}: "${escaped}"\n`
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      yaml += `${spaces}${key}: ${value}\n`
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        yaml += `${spaces}${key}: []\n`
      } else if (typeof value[0] === 'object') {
        yaml += `${spaces}${key}:\n`
        for (const item of value) {
          yaml += `${spaces}  -\n`
          yaml += toYaml(item as Record<string, unknown>, indent + 2)
        }
      } else {
        yaml += `${spaces}${key}:\n`
        for (const item of value) {
          if (typeof item === 'string') {
            const escaped = item.replace(/"/g, '\\"')
            yaml += `${spaces}  - "${escaped}"\n`
          } else {
            yaml += `${spaces}  - ${item}\n`
          }
        }
      }
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n`
      yaml += toYaml(value as Record<string, unknown>, indent + 1)
    }
  }

  return yaml
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function saveBookToYaml(
  book: ProcessedBook,
  outputDir: string
): Promise<void> {
  const filename = `${book.bookId}-${sanitizeFilename(book.title)}.yml`
  const filepath = path.join(outputDir, filename)

  const yamlContent = toYaml({
    bookId: book.bookId,
    userBookId: book.userBookId,
    title: book.title,
    subtitle: book.subtitle,
    slug: book.slug,
    description: book.description,
    authors: book.authors,
    coverImage: book.coverImage,
    pages: book.pages,
    releaseDate: book.releaseDate,
    releaseYear: book.releaseYear,
    status: book.status,
    statusDisplay: book.statusDisplay,
    rating: book.rating,
    dateAdded: book.dateAdded,
    firstReadDate: book.firstReadDate,
    lastReadDate: book.lastReadDate,
    readCount: book.readCount,
    owned: book.owned,
    starred: book.starred,
    review: book.review,
    communityRating: book.communityRating,
    ratingsCount: book.ratingsCount,
    reviewsCount: book.reviewsCount,
    seriesName: book.seriesName,
    seriesPosition: book.seriesPosition,
    editionId: book.editionId,
    editionFormat: book.editionFormat,
    isbn10: book.isbn10,
    isbn13: book.isbn13,
    publisher: book.publisher,
    hardcoverUrl: book.hardcoverUrl,
    updatedAt: book.updatedAt
  })

  fs.writeFileSync(filepath, yamlContent)
}

async function saveProfileToYaml(
  profile: HardcoverProfile,
  outputDir: string
): Promise<void> {
  const filepath = path.join(outputDir, 'profile.yml')

  const yamlContent = toYaml({
    userId: profile.userId,
    username: profile.username,
    name: profile.name,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    profileUrl: profile.profileUrl,
    location: profile.location,
    link: profile.link,
    booksCount: profile.booksCount,
    followersCount: profile.followersCount,
    followingCount: profile.followingCount,
    createdAt: profile.createdAt,
    wantToReadCount: profile.wantToReadCount,
    currentlyReadingCount: profile.currentlyReadingCount,
    readCount: profile.readCount,
    didNotFinishCount: profile.didNotFinishCount,
    ownedCount: profile.ownedCount,
    averageRating: profile.averageRating,
    totalPagesRead: profile.totalPagesRead,
    lastUpdated: profile.lastUpdated
  })

  fs.writeFileSync(filepath, yamlContent)
}

async function main() {
  const args = process.argv.slice(2)

  // Parse arguments
  let token = process.env.HARDCOVER_API_TOKEN || ''
  let userId: number | null = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--token' && args[i + 1]) {
      token = args[i + 1]
      i++
    } else if (args[i] === '--userid' && args[i + 1]) {
      userId = parseInt(args[i + 1], 10)
      i++
    }
  }

  if (!token) {
    console.error(
      '❌ HARDCOVER_API_TOKEN environment variable or --token flag is required'
    )
    console.error(
      '   Get your API token from: https://hardcover.app/account/api'
    )
    process.exit(1)
  }

  // Setup output directory
  const outputDir = path.join(process.cwd(), 'content', 'books')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Fetch current user if user ID not provided
  console.log(`\n👤 Fetching user profile...`)
  const user = await getCurrentUser(token)

  if (!userId) {
    userId = user.id
  }

  console.log(`✅ Found user: ${user.username} (ID: ${user.id})`)
  console.log(`   📖 ${user.books_count} books in library`)

  // Fetch all user books
  console.log(`\n📚 Fetching books library...`)
  const userBooks = await getUserBooks(token, userId)
  console.log(`✅ Found ${userBooks.length} books`)

  // Process books
  console.log(`\n🔄 Processing books...`)
  const processedBooks = userBooks.map(processBook)

  // Calculate stats
  const statusCounts = {
    wantToRead: 0,
    currentlyReading: 0,
    read: 0,
    didNotFinish: 0,
    owned: 0
  }

  let totalRating = 0
  let ratedCount = 0
  let totalPagesRead = 0

  for (const book of processedBooks) {
    switch (book.status) {
      case 'WANT_TO_READ':
        statusCounts.wantToRead++
        break
      case 'CURRENTLY_READING':
        statusCounts.currentlyReading++
        break
      case 'READ':
        statusCounts.read++
        if (book.pages) {
          totalPagesRead += book.pages * book.readCount
        }
        break
      case 'DID_NOT_FINISH':
        statusCounts.didNotFinish++
        break
      case 'OWNED':
        statusCounts.owned++
        break
    }

    if (book.rating) {
      totalRating += book.rating
      ratedCount++
    }
  }

  const averageRating =
    ratedCount > 0 ? Math.round((totalRating / ratedCount) * 100) / 100 : null

  // Build profile
  const profile: HardcoverProfile = {
    userId: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.image?.url || null,
    profileUrl: `https://hardcover.app/@${user.username}`,
    location: user.location,
    link: user.link,
    booksCount: user.books_count,
    followersCount: user.followers_count,
    followingCount: user.followed_users_count,
    createdAt: user.created_at,
    wantToReadCount: statusCounts.wantToRead,
    currentlyReadingCount: statusCounts.currentlyReading,
    readCount: statusCounts.read,
    didNotFinishCount: statusCounts.didNotFinish,
    ownedCount: statusCounts.owned,
    averageRating,
    totalPagesRead,
    lastUpdated: Math.floor(Date.now() / 1000)
  }

  // Clear existing files
  console.log(`\n🗑️  Clearing existing book files...`)
  const existingFiles = fs
    .readdirSync(outputDir)
    .filter(f => f.endsWith('.yml'))
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(outputDir, file))
  }

  // Save profile
  console.log(`💾 Saving profile...`)
  await saveProfileToYaml(profile, outputDir)

  // Save books
  console.log(`💾 Saving ${processedBooks.length} books to YAML...`)
  for (const book of processedBooks) {
    await saveBookToYaml(book, outputDir)
  }

  console.log(`\n✅ Hardcover sync complete!`)
  console.log(`   Profile: ${profile.username}`)
  console.log(`   Books: ${profile.booksCount} total`)
  console.log(`   📖 Want to Read: ${statusCounts.wantToRead}`)
  console.log(`   📗 Currently Reading: ${statusCounts.currentlyReading}`)
  console.log(`   ✅ Read: ${statusCounts.read}`)
  console.log(`   📕 Did Not Finish: ${statusCounts.didNotFinish}`)
  console.log(`   📚 Owned: ${statusCounts.owned}`)
  if (averageRating) {
    console.log(`   ⭐ Average Rating: ${averageRating}`)
  }
  console.log(`   📄 Total Pages Read: ${totalPagesRead.toLocaleString()}`)
  console.log(`   Output: ${outputDir}`)
  console.log(`\n📝 Run 'npx velite' to regenerate static content`)
}

main().catch(error => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
