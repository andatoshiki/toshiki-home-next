export interface LastFmUser {
  name: string
  registered: number
  totalPlays: number
  image: string
  url: string
}

export interface LastFmSong {
  name: string
  artist: string
  image: string
  url: string
  date: number
  plays?: number
  nowPlaying: boolean
}

export interface LastFmArtist {
  name: string
  plays: number
  image: string
  url: string
}

export interface LastFmResponse {
  user: LastFmUser
  topTracks: LastFmSong[]
  recentTracks: LastFmSong[]
  topArtists: LastFmArtist[]
}
