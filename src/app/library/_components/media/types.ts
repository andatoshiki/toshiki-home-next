// Types for AniList API responses

export interface MediaTitle {
  romaji: string
  english: string | null
  native: string
  userPreferred: string
}

export interface MediaCoverImage {
  extraLarge: string
  large: string
  medium: string
  color: string | null
}

export interface Media {
  id: number
  title: MediaTitle
  description: string | null
  coverImage: MediaCoverImage
  episodes: number | null
  chapters: number | null
  volumes: number | null
  format: string
  status: string
  siteUrl: string
}

export interface MediaListEntry {
  id: number
  status:
    | 'CURRENT'
    | 'PLANNING'
    | 'COMPLETED'
    | 'DROPPED'
    | 'PAUSED'
    | 'REPEATING'
  score: number
  progress: number
  updatedAt: number
  createdAt: number
  media: Media
}

export interface MediaListGroup {
  name: string
  entries: MediaListEntry[]
}

export interface MediaListCollection {
  lists: MediaListGroup[]
}

export interface AniListResponse {
  data: {
    MediaListCollection: MediaListCollection
  }
}
