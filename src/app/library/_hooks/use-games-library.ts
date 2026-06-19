'use client'

import { useState, useEffect, useMemo } from 'react'
import type {
  GameEntry,
  SteamProfile,
  GameFilterOption,
  GameSortOption
} from '../_components/games/types'
import {
  getLocalGamesList,
  getLocalSteamProfile
} from '../_components/games/local-data'
import { clampPage, GAMES_PER_PAGE } from './use-library-query-state'

export function useGamesLibrary(
  currentPage: number,
  activeFilter: GameFilterOption,
  activeSort: GameSortOption
) {
  const [games, setGames] = useState<GameEntry[]>([])
  const [profile, setProfile] = useState<SteamProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const localGames = getLocalGamesList()
      const localProfile = getLocalSteamProfile()
      setGames(localGames)
      setProfile(localProfile)
      setLoading(false)
      if (localGames.length === 0) {
        setError(
          "No local games data found. Run 'npx tsx tools/sync-steam.ts' to sync."
        )
      }
    } catch {
      setError('Failed to load local games data')
      setLoading(false)
    }
  }, [])

  const filterCounts = useMemo(
    () => ({
      all: games.length,
      played: games.filter(g => g.hasPlaytime).length,
      unplayed: games.filter(g => !g.hasPlaytime).length
    }),
    [games]
  )

  const filteredGames = useMemo(() => {
    let filtered = [...games]

    if (activeFilter === 'played')
      filtered = filtered.filter(g => g.hasPlaytime)
    else if (activeFilter === 'unplayed')
      filtered = filtered.filter(g => !g.hasPlaytime)

    switch (activeSort) {
      case 'playtime':
        filtered.sort((a, b) => b.playtimeMinutes - a.playtimeMinutes)
        break
      case 'recent':
        filtered.sort((a, b) => (b.lastPlayed ?? 0) - (a.lastPlayed ?? 0))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'metacritic':
        filtered.sort(
          (a, b) => (b.metacriticScore ?? 0) - (a.metacriticScore ?? 0)
        )
        break
    }

    return filtered
  }, [games, activeFilter, activeSort])

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE)
  const page = clampPage(currentPage, totalPages)

  const paginatedGames = useMemo(() => {
    const start = (page - 1) * GAMES_PER_PAGE
    return filteredGames.slice(start, start + GAMES_PER_PAGE)
  }, [filteredGames, page])

  return {
    games,
    profile,
    loading,
    error,
    filterCounts,
    filteredGames,
    paginatedGames,
    totalPages,
    currentPage: page
  }
}
