'use client'

import { ErrorBoundary } from 'react-error-boundary'

import { FallbackError } from '../fallback-error'
import { useGithubData } from '~/hooks/use-github-data'

import { GithubStatsSkeleton } from './skeleton'
import { Followers } from './cards/followers'
import { Languages } from './cards/languages'
import { Repos } from './cards/repos'
import { Stars } from './cards/stars'
import { Contributions } from './cards/contributions'
import { ContributionCalendar } from './cards/contribution-calendar'
import { LineGraph } from './cards/line-graph'

export function GithubDashboard() {
  const { snapshot, metrics, error, isLoading } = useGithubData()

  if (isLoading) {
    return <GithubStatsSkeleton />
  }

  if (error || !snapshot || !metrics) {
    return <FallbackError />
  }

  return (
    <ErrorBoundary fallback={<FallbackError />}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="col-span-2 row-span-2">
          <Followers
            followers={snapshot.followers}
            followersCount={metrics.followersCount}
          />
        </div>

        <Stars stars={metrics.stars} />
        <Languages languages={metrics.languages} />
        <Repos repositories={metrics.repositoryCount} />
        <Contributions contributions={metrics.contributionCount} />

        <div className="col-span-4">
          <ContributionCalendar
            contributions={snapshot.contributions}
            totalContributions={metrics.totalContributionsLastYear}
          />
        </div>

        <div className="col-span-4">
          <LineGraph data={metrics.contributionSeries} />
        </div>
      </div>
    </ErrorBoundary>
  )
}
