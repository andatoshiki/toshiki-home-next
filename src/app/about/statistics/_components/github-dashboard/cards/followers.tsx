'use client'

import { useMemo } from 'react'
import Image from 'next/image'

import { Heart } from '@phosphor-icons/react/dist/ssr'
import { placeholder } from '~/lib/placeholder'
import { shuffleArray } from '~/lib/shuffleArray'
import { GithubFollower } from '~/lib/api/github'

const AVATAR_COUNT = 71

interface FollowersProps {
  followers: GithubFollower[]
  followersCount: number
}

export function Followers({ followers, followersCount }: FollowersProps) {
  const slicedFollowers = useMemo(
    () => shuffleArray([...followers]).slice(0, AVATAR_COUNT),
    [followers]
  )

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2 rounded-3xl border border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600">
        <span>Followers</span>
        <Heart size="1em" weight="duotone" />
      </span>
      <span className="text-xl">
        <div className="grid grid-cols-12 gap-1">
          {slicedFollowers.map(follower => (
            <a
              href={follower.html_url}
              key={follower.login}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={follower.avatar_url}
                title={follower.login}
                alt=""
                width={400}
                height={400}
                placeholder={placeholder(28, 28) as `data:image/${string}`}
                className="w-7 rounded-full border-2 border-neutral-200 transition-all hover:border-neutral-600 dark:border-neutral-950 dark:hover:border-neutral-400"
              />
            </a>
          ))}
          <a
            href="https://github.com/andatoshiki?tab=followers&ref=https://toshiki.dev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center text-sm leading-none transition-colors hover:underline"
          >
            +{Math.max(followersCount - AVATAR_COUNT, 0)}
          </a>
        </div>
      </span>
    </div>
  )
}
