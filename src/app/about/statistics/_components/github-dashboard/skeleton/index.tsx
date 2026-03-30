import { FollowersSkeleton } from './follower'
import { StarsSkeleton } from './stars'
import { LanguagesSkeleton } from './languages'
import { ReposSkeleton } from './repos'
import { ContributionsSkeleton } from './contributions'
import { GraphSkeleton } from './graph'
import { LineGraphSkeleton } from '../cards/line-graph/skeleton'

export function GithubStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="col-span-2 row-span-2">
        <FollowersSkeleton />
      </div>

      <StarsSkeleton />
      <LanguagesSkeleton />
      <ReposSkeleton />

      <ContributionsSkeleton />

      <div className="col-span-4">
        <GraphSkeleton />
      </div>

      <div className="col-span-4">
        <LineGraphSkeleton />
      </div>
    </div>
  )
}
