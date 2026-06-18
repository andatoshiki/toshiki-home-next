export type LastFmPeriod =
  | 'overall'
  | '7day'
  | '1month'
  | '3month'
  | '6month'
  | '12month'

export interface LastFmUser {
  name: string
  registered: number
  totalPlays: number
  image: string
  url: string
}

export interface LastFmTrack {
  name: string
  artist: string
  image: string
  url: string
  date?: number
  plays?: number
  nowPlaying: boolean
}

export interface LastFmArtist {
  name: string
  plays: number
  image: string
  url: string
}

export interface LastFmSummaryResponse {
  user: LastFmUser
  topTracks: LastFmTrack[]
  recentTracks: LastFmTrack[]
  topArtists: LastFmArtist[]
}

export interface LastFmUserResponse {
  user: LastFmUser
}

export interface LastFmTracksResponse {
  period?: LastFmPeriod
  tracks: LastFmTrack[]
}

export interface LastFmArtistsResponse {
  period: LastFmPeriod
  artists: LastFmArtist[]
}

export interface LastFmNowPlayingResponse {
  track: LastFmTrack | null
  nowPlaying: boolean
}
