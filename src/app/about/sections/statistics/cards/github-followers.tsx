'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { GithubLogo } from '@phosphor-icons/react/dist/ssr'

import { shuffleArray } from '~/lib/shuffleArray'
import { placeholder } from '~/lib/placeholder'
import { useGithubData } from '~/hooks/use-github-data'

import { Card } from '../card'

const avatarCount = 8

export function GithubFollowers() {
  const { snapshot, metrics, isLoading } = useGithubData()
  const followersList = snapshot?.followers ?? []
  const slicedFollowers = useMemo(
    () => shuffleArray([...followersList]).slice(0, avatarCount),
    [followersList]
  )

  if (!snapshot || !metrics) {
    return (
      <Card
        title="Github Followers"
        icon={<GithubLogo size="1em" weight="duotone" />}
        content={isLoading ? '...' : '-'}
      />
    )
  }

  return (
    <>
      <Card
        title="Github Followers"
        icon={<GithubLogo size="1em" weight="duotone" />}
        content={
          <div className="flex items-center gap-2">
            <div className="flex flex-row-reverse justify-end">
              {slicedFollowers.map(follower => (
                <a
                  href={follower.html_url}
                  key={follower.login}
                  target="_blank"
                  rel="noreferrer"
                  className="-ml-3 last:m-0"
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
            </div>
            <a
              href="https://github.com/andatoshiki?tab=followers&ref=https://toshiki.dev"
              target="_blank"
              rel="noreferrer"
              className="text-base transition-colors hover:text-black dark:hover:text-white"
            >
              +{Math.max(metrics.followersCount - avatarCount, 0)}
            </a>
          </div>
        }
      />
    </>
  )
}
