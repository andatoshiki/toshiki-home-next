'use client'

import { GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { useGithubData } from '~/hooks/use-github-data'

import { Card } from '../card'

export function GithubStars() {
  const { metrics, isLoading } = useGithubData()

  return (
    <Card
      title="Github Stars"
      icon={<GithubLogo size="1em" weight="duotone" />}
      content={metrics ? String(metrics.stars) : isLoading ? '...' : '-'}
    />
  )
}
