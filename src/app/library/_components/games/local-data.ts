// Load local games data from Velite collections

import { gamesList, steamProfile } from '#content'
import { GameEntry, SteamProfile } from './types'

export function getLocalGamesList(): GameEntry[] {
  try {
    // Filter out hidden games and sort by playtime
    return (gamesList as GameEntry[])
      .filter(game => !game.hidden)
      .sort((a, b) => b.playtimeMinutes - a.playtimeMinutes)
  } catch {
    console.warn(
      'No local games data found. Run `npx tsx tools/sync-steam.ts` to sync.'
    )
    return []
  }
}

export function getLocalSteamProfile(): SteamProfile | null {
  try {
    return steamProfile as SteamProfile
  } catch {
    console.warn(
      'No local Steam profile found. Run `npx tsx tools/sync-steam.ts` to sync.'
    )
    return null
  }
}
