import { defineCollection, s } from 'velite'

// Helper to handle null values from YAML
const nullableString = s
  .union([s.string(), s.null()])
  .transform(v => v ?? undefined)
const nullableNumber = s
  .union([s.number(), s.null()])
  .transform(v => v ?? undefined)

export const hardcoverProfile = defineCollection({
  name: 'HardcoverProfile',
  pattern: 'books/profile.yml',
  single: true,
  schema: s.object({
    userId: s.number(),
    username: s.string(),
    name: nullableString.optional(),
    bio: nullableString.optional(),
    avatarUrl: nullableString.optional(),
    profileUrl: s.string(),
    location: nullableString.optional(),
    link: nullableString.optional(),
    booksCount: s.number(),
    followersCount: s.number(),
    followingCount: s.number(),
    createdAt: s.string(),
    // Status counts
    wantToReadCount: s.number().default(0),
    currentlyReadingCount: s.number().default(0),
    readCount: s.number().default(0),
    didNotFinishCount: s.number().default(0),
    ownedCount: s.number().default(0),
    // Stats
    averageRating: nullableNumber.optional(),
    totalPagesRead: s.number().default(0),
    lastUpdated: s.number()
  })
})

export const booksList = defineCollection({
  name: 'BookEntry',
  pattern: 'books/[0-9]*.yml',
  schema: s
    .object({
      // Book identification
      bookId: s.number(),
      userBookId: s.number(),
      title: s.string(),
      subtitle: nullableString.optional(),
      slug: nullableString.optional(),
      description: nullableString.optional(),

      // Authors
      authors: s.array(s.string()).default([]),

      // Images
      coverImage: nullableString.optional(),

      // Book details
      pages: nullableNumber.optional(),
      releaseDate: nullableString.optional(),
      releaseYear: nullableNumber.optional(),

      // User status
      status: s.string(),
      statusDisplay: s.string(),
      rating: nullableNumber.optional(),
      dateAdded: s.string(),
      firstReadDate: nullableString.optional(),
      lastReadDate: nullableString.optional(),
      readCount: s.number().default(0),
      owned: s.boolean().default(false),
      starred: s.boolean().default(false),
      review: nullableString.optional(),

      // Community stats
      communityRating: nullableNumber.optional(),
      ratingsCount: s.number().default(0),
      reviewsCount: s.number().default(0),

      // Series info
      seriesName: nullableString.optional(),
      seriesPosition: nullableNumber.optional(),

      // Edition info
      editionId: nullableNumber.optional(),
      editionFormat: nullableString.optional(),
      isbn10: nullableString.optional(),
      isbn13: nullableString.optional(),
      publisher: nullableString.optional(),

      // URLs
      hardcoverUrl: s.string(),
      updatedAt: s.string(),

      // Custom fields for manual additions
      customNote: nullableString.optional(),
      customTags: s.array(s.string()).optional().default([]),
      featured: s.boolean().optional().default(false),
      hidden: s.boolean().optional().default(false)
    })
    .transform(data => ({
      ...data,
      // Calculate additional fields
      hasRating: data.rating !== null && data.rating !== undefined,
      isRead: data.status === 'READ',
      isCurrentlyReading: data.status === 'CURRENTLY_READING',
      isWantToRead: data.status === 'WANT_TO_READ',
      authorDisplay:
        data.authors.length > 0 ? data.authors.join(', ') : 'Unknown Author',
      ratingFormatted: data.rating ? `${data.rating}/5` : null
    }))
})
