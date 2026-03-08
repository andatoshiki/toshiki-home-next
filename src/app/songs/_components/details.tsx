import React from 'react'
import Image from 'next/image'
import { Fire, Calendar } from '@phosphor-icons/react/dist/ssr'
import { LinkV2 } from '~/components/ui/link-v2'
import { LastFmUser } from '../types'

interface DetailsProps {
  user: LastFmUser
}

export function Details({ user }: DetailsProps) {
  const accountAge =
    new Date().getFullYear() - new Date(user.registered * 1000).getFullYear()

  return (
    <div className="grid gap-x-0 gap-y-4 md:grid-cols-2 md:gap-x-12">
      {/* Profile */}
      <div className="flex items-center justify-between space-x-4">
        <span className="text-neutral-500 dark:text-neutral-500">Profile</span>
        <div className="flex items-center space-x-2">
          <LinkV2
            label={`@${user.name}`}
            href={user.url}
            className="flex-shrink-0 text-neutral-500 dark:text-neutral-500"
          />
          {user.image && (
            <Image
              src={user.image}
              alt={user.name}
              width={24}
              height={24}
              className="h-6 w-6 rounded-full"
            />
          )}
        </div>
      </div>

      {/* Total Plays */}
      <div className="flex items-center justify-between space-x-4">
        <span className="flex-shrink-0 text-neutral-500 dark:text-neutral-500">
          Total Plays
        </span>
        <div className="flex items-center space-x-2">
          <div className="truncate text-neutral-500 dark:text-neutral-500">
            {user.totalPlays.toLocaleString()}
          </div>
          <Fire
            className="h-6 w-6 text-red-700 dark:text-red-400"
            weight="fill"
          />
        </div>
      </div>

      {/* Account Age */}
      <div className="flex items-center justify-between space-x-4">
        <span className="flex-shrink-0 text-neutral-500 dark:text-neutral-500">
          Account Age
        </span>
        <div className="flex items-center space-x-2">
          <div className="truncate text-neutral-500 dark:text-neutral-500">
            {accountAge} year{accountAge !== 1 ? 's' : ''}
          </div>
          <Calendar className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
