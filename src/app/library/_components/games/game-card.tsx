'use client'

import Image from 'next/image'
import { GameEntry } from './types'
import { Clock, GameController } from '@phosphor-icons/react'

interface GameCardProps {
  game: GameEntry
}

export function GameCard({ game }: GameCardProps) {
  const developerText =
    game.developers.length > 0
      ? game.developers.slice(0, 2).join(', ')
      : 'Unknown Developer'

  return (
    <a
      href={game.storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Header Image */}
      <div className="relative aspect-[460/215] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <Image
          src={game.headerImage}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />

        {/* Metacritic Score Badge */}
        {game.metacriticScore && game.metacriticScore > 0 && (
          <div
            className={`absolute right-2 top-2 rounded px-1.5 py-0.5 text-xs font-bold text-white ${
              game.metacriticScore >= 75
                ? 'bg-green-600'
                : game.metacriticScore >= 50
                  ? 'bg-yellow-600'
                  : 'bg-red-600'
            }`}
          >
            {game.metacriticScore}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {game.name}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
          {developerText}
        </p>

        {/* Playtime */}
        <div className="mt-auto flex items-center gap-1.5 pt-2">
          <Clock className="h-3.5 w-3.5 text-neutral-400" weight="fill" />
          <span
            className={`text-xs ${
              game.hasPlaytime
                ? 'text-neutral-600 dark:text-neutral-300'
                : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {game.playtimeFormatted}
          </span>
        </div>

        {/* Genres */}
        {game.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {game.genres.slice(0, 2).map((genre, idx) => (
              <span
                key={idx}
                className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}
