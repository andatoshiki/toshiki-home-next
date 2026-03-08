'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HardcoverProfile } from './types'
import {
  BookOpen,
  BookBookmark,
  Books,
  Star,
  FileText,
  ArrowSquareOut,
  Users,
  Heart,
  Clock
} from '@phosphor-icons/react'

interface HardcoverProfileCardProps {
  profile: HardcoverProfile
}

export function HardcoverProfileCard({ profile }: HardcoverProfileCardProps) {
  const memberSince = new Date(profile.createdAt).getFullYear()
  const currentYear = new Date().getFullYear()
  const memberYears = currentYear - memberSince

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Card 1: Profile Info */}
      <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-neutral-100 p-5 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Top: Avatar + Name + Key Stats */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-neutral-300 dark:border-neutral-700">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.username}
                  width={56}
                  height={56}
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xl font-bold text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.name || profile.username}
              </h2>
              <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                @{profile.username}
              </p>
            </div>
          </div>
          {/* Key stats on right - vertical layout with icons */}
          <div className="flex flex-col gap-1 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.totalPagesRead.toLocaleString()}
              </span>
              <FileText
                className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
                weight="fill"
              />
            </div>
            {profile.averageRating && (
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {profile.averageRating.toFixed(1)}
                </span>
                <Star
                  className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
                  weight="fill"
                />
              </div>
            )}
          </div>
        </div>

        {/* Middle: Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="text-center">
            <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {profile.followersCount}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Followers
            </span>
          </div>
          <div className="text-center">
            <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {profile.followingCount}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Following
            </span>
          </div>
          <div className="text-center">
            <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {memberYears > 0 ? `${memberYears}y` : '<1y'}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Member
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
          View Hardcover Profile
          <ArrowSquareOut className="h-4 w-4" weight="bold" />
        </Link>
      </div>

      {/* Card 2: Reading Stats */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5">
            <Books
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.booksCount}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Total Books
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <BookOpen
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.currentlyReadingCount}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Reading
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <BookBookmark
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.wantToReadCount}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Want to Read
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Heart
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.readCount}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Read
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <FileText
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.totalPagesRead.toLocaleString()}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Pages Read
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Star
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.averageRating?.toFixed(1) || '—'}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Avg Rating
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Books
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              weight="fill"
            />
            <div>
              <span className="block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.ownedCount}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Owned
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
                {profile.didNotFinishCount}
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                DNF
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
