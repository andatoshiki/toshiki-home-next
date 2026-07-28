import { animeList, mangaList } from '#content'
import type { MediaListEntry, Media } from './types'

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
  return animeList
    .map(transformVeliteEntry)
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getLocalMangaList(): MediaListEntry[] {
  return mangaList
    .map(transformVeliteEntry)
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getLocalMediaList(type: 'ANIME' | 'MANGA'): MediaListEntry[] {
  return type === 'ANIME' ? getLocalAnimeList() : getLocalMangaList()
}
