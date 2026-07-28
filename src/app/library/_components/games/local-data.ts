// Load local games data from Velite collections

import { gamesList, steamProfile } from '#content'
import type { GameEntry, SteamProfile } from './types'

export function getLocalGamesList(): GameEntry[] {
  return (gamesList as GameEntry[])
    .filter(game => !game.hidden)
    .sort((a, b) => b.playtimeMinutes - a.playtimeMinutes)
}

export function getLocalSteamProfile(): SteamProfile | null {
  return steamProfile as SteamProfile
}
