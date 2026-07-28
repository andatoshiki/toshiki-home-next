'use client'

import { useMemo } from 'react'
import type {
  GameFilterOption,
  GameSortOption
} from '../_components/games/types'
import {
  getLocalGamesList,
  getLocalSteamProfile
} from '../_components/games/local-data'
import { clampPage, GAMES_PER_PAGE } from './use-library-query-state'

const games = getLocalGamesList()
const profile = getLocalSteamProfile()

export function useGamesLibrary(
  currentPage: number,
  activeFilter: GameFilterOption,
  activeSort: GameSortOption
) {
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
    filterCounts,
    filteredGames,
    paginatedGames,
    totalPages,
    currentPage: page
  }
}
