'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SteamProfile } from './types'
import {
  GameController,
  Clock,
  CurrencyDollar,
  Trophy,
  ChartBar,
  ArrowSquareOut,
  Gift,
  ShoppingCart
} from '@phosphor-icons/react'

interface SteamProfileCardProps {
  profile: SteamProfile
}

export function SteamProfileCard({ profile }: SteamProfileCardProps) {
  const totalValue = (profile.totalValueCents / 100).toFixed(2)
  const pricePerHour = (profile.pricePerHour / 100).toFixed(2)
  const gamesPlayedPercent = Math.round(
    (profile.gamesPlayed / profile.totalGames) * 100
  )
  const accountAge = profile.createdAt
    ? Math.floor(
        (Date.now() / 1000 - profile.createdAt) / (365.25 * 24 * 60 * 60)
      )
    : null
  const avgPerGame =
    profile.gamesPlayed > 0
      ? Math.round(profile.totalPlaytimeHours / profile.gamesPlayed)
      : 0

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Card 1: Profile Info */}
      <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-neutral-100 p-5 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Top: Avatar + Name + Key Stats */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-neutral-300 dark:border-neutral-700">
              <Image
                src={profile.avatarFull}
                alt={profile.personaName}
                width={56}
                height={56}
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.personaName}
              </h2>
              <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                @
                {profile.profileUrl.split('/id/')[1]?.replace(/\/$/, '') ||
                  profile.steamId}
              </p>
            </div>
          </div>
          {/* Key stats on right - vertical layout with icons */}
          <div className="flex flex-col gap-1 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.totalPlaytimeHours.toLocaleString()}h
              </span>
              <Clock
                className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
                weight="fill"
              />
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                ${totalValue}
              </span>
              <CurrencyDollar
                className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
                weight="fill"
              />
            </div>
          </div>
        </div>

        {/* Middle: Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="text-center">
            <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {profile.level}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Level
            </span>
          </div>
          <div className="text-center">
            <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {profile.country || '—'}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Country
            </span>
          </div>
          <div className="text-center">
            <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {accountAge !== null ? `${accountAge}y` : '—'}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Account
            </span>
          </div>
        </div>

        {/* Bottom: Link */}
        <Link
          href={profile.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
        >
          View Steam Profile
          <ArrowSquareOut className="h-4 w-4" weight="bold" />
        </Link>
      </div>

      {/* Card 2: Stats */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5">
            <GameController
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.totalGames}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Games
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Trophy
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.gamesPlayed}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Played ({gamesPlayedPercent}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Gift
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.freeGames}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Free
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ShoppingCart
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.paidGames}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Paid
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ChartBar
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {avgPerGame}h
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Avg/Game
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CurrencyDollar
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                ${pricePerHour}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Per Hour
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.hoursInFreeGames.toLocaleString()}h
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                In Free
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.hoursInPaidGames.toLocaleString()}h
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                In Paid
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
