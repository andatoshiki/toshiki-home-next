// Types for Steam games data

export interface SteamProfile {
  steamId: string
  personaName: string
  profileUrl: string
  avatar: string
  avatarMedium: string
  avatarFull: string
  level: number
  createdAt?: number
  country?: string
  realName?: string
  totalGames: number
  totalPlaytimeHours: number
  gamesPlayed: number
  // Extended stats
  freeGames: number
  paidGames: number
  totalValueCents: number
  playedValueCents: number
  unplayedValueCents: number
  pricePerHour: number
  hoursInFreeGames: number
  hoursInPaidGames: number
  lastUpdated: number
}

export interface GameEntry {
  appid: number
  name: string
  playtimeMinutes: number
  playtimeHours: number
  playtime2Weeks?: number
  lastPlayed?: number
  iconUrl: string
  headerImage: string
  capsuleImage: string
  developers: string[]
  publishers: string[]
  genres: string[]
  releaseDate?: string
  shortDescription?: string
  metacriticScore?: number
  isFree: boolean
  priceCents?: number
  storeUrl: string
  customNote?: string
  customTags: string[]
  featured: boolean
  hidden: boolean
  hasPlaytime: boolean
  playtimeFormatted: string
}

export type GameSortOption = 'playtime' | 'name' | 'recent' | 'metacritic'
export type GameFilterOption = 'all' | 'played' | 'unplayed'
