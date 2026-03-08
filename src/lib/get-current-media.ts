import { booksList, animeList } from '#content'

export interface BookData {
  title: string
  cover: string
  url: string
  authors: string[]
  pages?: number
  type: 'book'
}

export interface AnimeData {
  title: string
  cover: string
  url: string
  progress: number
  episodes: number
  description: string
  type: 'anime'
}

export type MediaData = BookData | AnimeData

function getCurrentBook(): BookData | null {
  try {
    const currentBooks = booksList
      .filter(book => book.status === 'CURRENTLY_READING' && !book.hidden)
      .map(book => ({
        title: book.title,
        cover: book.coverImage || '',
        url: book.hardcoverUrl,
        authors: book.authors,
        pages: book.pages,
        type: 'book' as const
      }))

    if (currentBooks.length === 0) return null

    // Sort alphabetically by title
    currentBooks.sort((a, b) => a.title.localeCompare(b.title))
    return currentBooks[0]
  } catch {
    return null
  }
}

function getCurrentAnime(): AnimeData | null {
  try {
    const currentAnimes = animeList
      .filter(anime => anime.status === 'CURRENT')
      .map(anime => ({
        title: anime.title.userPreferred || anime.title.romaji,
        cover: anime.coverImage.extraLarge || anime.coverImage.large || '',
        url: anime.siteUrl,
        progress: anime.progress || 0,
        episodes: anime.episodes || 0,
        description: anime.description || '',
        type: 'anime' as const
      }))

    if (currentAnimes.length === 0) return null

    // Sort alphabetically by title
    currentAnimes.sort((a, b) => a.title.localeCompare(b.title))
    return currentAnimes[0]
  } catch {
    return null
  }
}

export function getCurrentMedia(): MediaData | null {
  // Prioritize book, then anime
  return getCurrentBook() || getCurrentAnime()
}
