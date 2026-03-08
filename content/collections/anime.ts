import { defineCollection, s } from 'velite'

// Helper to handle null values from YAML
const nullableString = s
  .union([s.string(), s.null()])
  .transform(v => v ?? undefined)
const nullableNumber = s
  .union([s.number(), s.null()])
  .transform(v => v ?? undefined)

export const animeList = defineCollection({
  name: 'AnimeEntry',
  pattern: 'anime/*.yml',
  schema: s
    .object({
      // Media identification
      id: s.number(),
      mediaId: s.number(),

      // Status and progress
      status: s.enum([
        'CURRENT',
        'PLANNING',
        'COMPLETED',
        'DROPPED',
        'PAUSED',
        'REPEATING'
      ]),
      score: s.number().default(0),
      progress: s.number().default(0),

      // Timestamps
      updatedAt: s.number(),
      createdAt: s.number(),

      // Media details
      title: s.object({
        romaji: s.string(),
        english: nullableString.optional(),
        native: s.string(),
        userPreferred: s.string()
      }),
      description: nullableString.optional(),
      coverImage: s.object({
        extraLarge: s.string(),
        large: s.string(),
        medium: s.string(),
        color: nullableString.optional()
      }),
      episodes: nullableNumber.optional(),
      chapters: nullableNumber.optional(),
      volumes: nullableNumber.optional(),
      format: s.string(),
      mediaStatus: s.string(),
      siteUrl: s.string(),

      // Custom fields for manual additions
      customNote: nullableString.optional(),
      customTags: s.array(s.string()).optional().default([]),
      featured: s.boolean().optional().default(false)
    })
    .transform(data => ({
      ...data,
      // Transform to match the API structure expected by components
      media: {
        id: data.mediaId,
        title: data.title,
        description: data.description || null,
        coverImage: {
          ...data.coverImage,
          color: data.coverImage.color || null
        },
        episodes: data.episodes || null,
        chapters: data.chapters || null,
        volumes: data.volumes || null,
        format: data.format,
        status: data.mediaStatus,
        siteUrl: data.siteUrl
      }
    }))
})

export const mangaList = defineCollection({
  name: 'MangaEntry',
  pattern: 'manga/*.yml',
  schema: s
    .object({
      // Media identification
      id: s.number(),
      mediaId: s.number(),

      // Status and progress
      status: s.enum([
        'CURRENT',
        'PLANNING',
        'COMPLETED',
        'DROPPED',
        'PAUSED',
        'REPEATING'
      ]),
      score: s.number().default(0),
      progress: s.number().default(0),

      // Timestamps
      updatedAt: s.number(),
      createdAt: s.number(),

      // Media details
      title: s.object({
        romaji: s.string(),
        english: nullableString.optional(),
        native: s.string(),
        userPreferred: s.string()
      }),
      description: nullableString.optional(),
      coverImage: s.object({
        extraLarge: s.string(),
        large: s.string(),
        medium: s.string(),
        color: nullableString.optional()
      }),
      episodes: nullableNumber.optional(),
      chapters: nullableNumber.optional(),
      volumes: nullableNumber.optional(),
      format: s.string(),
      mediaStatus: s.string(),
      siteUrl: s.string(),

      // Custom fields for manual additions
      customNote: nullableString.optional(),
      customTags: s.array(s.string()).optional().default([]),
      featured: s.boolean().optional().default(false)
    })
    .transform(data => ({
      ...data,
      // Transform to match the API structure expected by components
      media: {
        id: data.mediaId,
        title: data.title,
        description: data.description || null,
        coverImage: {
          ...data.coverImage,
          color: data.coverImage.color || null
        },
        episodes: data.episodes || null,
        chapters: data.chapters || null,
        volumes: data.volumes || null,
        format: data.format,
        status: data.mediaStatus,
        siteUrl: data.siteUrl
      }
    }))
})
