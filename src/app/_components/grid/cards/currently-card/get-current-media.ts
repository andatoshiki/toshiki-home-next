import { animeList, mangaList } from '#content'

export interface CurrentMedia {
  id: number
  type: 'anime' | 'manga'
  title: string
  description: string | null
  progress: number
  total: number | null
  coverImage: string
  siteUrl: string
  format: string
}

/**
 * Strip HTML tags from description
 */
function stripHtml(html: string | null): string | null {
  if (!html) return null
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * Get the currently watching/reading media from velite data.
 * Returns the first item alphabetically with CURRENT status.
 */
export function getCurrentMedia(): CurrentMedia | null {
  // Get all CURRENT status entries from both anime and manga
  const currentAnime = animeList
    .filter(entry => entry.status === 'CURRENT')
    .map(entry => ({
      id: entry.mediaId,
      type: 'anime' as const,
      title: entry.title.userPreferred || entry.title.romaji,
      description: stripHtml(entry.description ?? null),
      progress: entry.progress,
      total: entry.episodes ?? null,
      coverImage: entry.coverImage.large,
      siteUrl: entry.siteUrl,
      format: entry.format
    }))

  const currentManga = mangaList
    .filter(entry => entry.status === 'CURRENT')
    .map(entry => ({
      id: entry.mediaId,
      type: 'manga' as const,
      title: entry.title.userPreferred || entry.title.romaji,
      description: stripHtml(entry.description ?? null),
      progress: entry.progress,
      total: entry.chapters ?? null,
      coverImage: entry.coverImage.large,
      siteUrl: entry.siteUrl,
      format: entry.format
    }))

  // Combine and sort alphabetically by title
  const allCurrent = [...currentAnime, ...currentManga].sort((a, b) =>
    a.title.localeCompare(b.title)
  )

  // Return the first one (alphabetically)
  return allCurrent.length > 0 ? allCurrent[0] : null
}

/**
 * Get all currently watching/reading media sorted alphabetically.
 */
export function getAllCurrentMedia(): CurrentMedia[] {
  const currentAnime = animeList
    .filter(entry => entry.status === 'CURRENT')
    .map(entry => ({
      id: entry.mediaId,
      type: 'anime' as const,
      title: entry.title.userPreferred || entry.title.romaji,
      description: stripHtml(entry.description ?? null),
      progress: entry.progress,
      total: entry.episodes ?? null,
      coverImage: entry.coverImage.large,
      siteUrl: entry.siteUrl,
      format: entry.format
    }))

  const currentManga = mangaList
    .filter(entry => entry.status === 'CURRENT')
    .map(entry => ({
      id: entry.mediaId,
      type: 'manga' as const,
      title: entry.title.userPreferred || entry.title.romaji,
      description: stripHtml(entry.description ?? null),
      progress: entry.progress,
      total: entry.chapters ?? null,
      coverImage: entry.coverImage.large,
      siteUrl: entry.siteUrl,
      format: entry.format
    }))

  return [...currentAnime, ...currentManga].sort((a, b) =>
    a.title.localeCompare(b.title)
  )
}
