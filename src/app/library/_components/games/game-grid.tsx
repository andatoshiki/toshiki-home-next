'use client'

import { GameEntry } from './types'
import { GameCard } from './game-card'

interface GameGridProps {
  games: GameEntry[]
}

export function GameGrid({ games }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {games.map(game => (
        <GameCard key={game.appid} game={game} />
      ))}
    </div>
  )
}
