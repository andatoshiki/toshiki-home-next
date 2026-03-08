// This file exports local anime/manga data from Velite collections
// Import this when ANIME_DATA_IS_LOCAL is set to true

// Note: This will only work after running `npx velite` to generate the data
// and after syncing data with `npx ts-node tools/sync-anilist.ts --all`

import { animeList, mangaList } from '#content'
import { MediaListEntry, Media } from './types'

// Transform Velite data to match MediaListEntry interface
function transformVeliteEntry(
  entry: (typeof animeList)[number] | (typeof mangaList)[number]
): MediaListEntry {
  // Transform media to handle undefined -> null conversion for optional fields
  const media: Media = {
    id: entry.media.id,
    title: {
      romaji: entry.media.title.romaji,
      english: entry.media.title.english ?? null,
      native: entry.media.title.native,
      userPreferred: entry.media.title.userPreferred
    },
    description: entry.media.description,
    coverImage: entry.media.coverImage,
    episodes: entry.media.episodes ?? null,
    chapters: entry.media.chapters ?? null,
    volumes: entry.media.volumes ?? null,
    format: entry.media.format,
    status: entry.media.status,
    siteUrl: entry.media.siteUrl
  }

  return {
    id: entry.id,
    status: entry.status,
    score: entry.score,
    progress: entry.progress,
    updatedAt: entry.updatedAt,
    createdAt: entry.createdAt,
    media
  }
}

export function getLocalAnimeList(): MediaListEntry[] {
  try {
    return animeList
      .map(transformVeliteEntry)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  } catch {
    console.warn(
      'No local anime data found. Run `npx ts-node tools/sync-anilist.ts --anime` to sync.'
    )
    return []
  }
}

export function getLocalMangaList(): MediaListEntry[] {
  try {
    return mangaList
      .map(transformVeliteEntry)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  } catch {
    console.warn(
      'No local manga data found. Run `npx ts-node tools/sync-anilist.ts --manga` to sync.'
    )
    return []
  }
}

export function getLocalMediaList(type: 'ANIME' | 'MANGA'): MediaListEntry[] {
  return type === 'ANIME' ? getLocalAnimeList() : getLocalMangaList()
}
