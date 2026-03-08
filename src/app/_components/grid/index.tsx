import { Book, Wrench } from '@phosphor-icons/react/dist/ssr'
import { DiscordStatus } from './cards/discord-status'
import { GithubLink } from './cards/github-link'
import { GithubStats } from './cards/github-stats'
import { LatestPost } from './cards/latest-post'
import { LetterboxedLink } from './cards/letterboxed-link'
import { LinksCard } from './cards/links'
import { MostListenedMusic } from './cards/most-listened-music'
import { StacksCard } from './cards/stacks-card'
import { CatCard } from './cards/cat-card'
import { AnalysisCard } from './cards/analysis'
import { BlogHeatmap } from '~/components/heatmap/heatmap'
import { WakatimeStats } from './cards/wakatime-card'
import { GithubStatsCard } from './cards/github-stats-card'
import { LastTrack } from '~/app/about/statistics/_components/spotify-dashboard/cards/last-track'
import { MoecounterCard } from './cards/moecounter-card'
import { MbtiCard } from './cards/mbti-card'
import { ReceiptCard } from './cards/ticket-printer/receipt-card'
import { getAllBlogPosts } from '~/components/heatmap/get-all-blogs'
import { LongTextCard } from './cards/currently-card/long-text-card'

const BooksCard = () => (
  <div className="relative flex items-center justify-center gap-2 rounded-xl border border-black/30 bg-black/5 p-5 dark:border-white/30 dark:bg-white/5">
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-5xl font-medium opacity-30 blur-sm">
      <Book weight="duotone" />
      <span>Books</span>
    </div>

    <Wrench />
    <span>Under construction...</span>
  </div>
)

export function Grid() {
  return (
    <div>
      {/* first row */}
      <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-6">
        <div className="col-span-3">
          <GithubLink />
        </div>
        <div className="col-span-2">
          <GithubStats />
        </div>
        <MostListenedMusic />
      </div>

      {/* second row */}
      <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
        <div className="col-span-3 flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="w-24">
              <LetterboxedLink />
            </div>
            <div className="flex w-full flex-col gap-3">
              <LinksCard />
            </div>
          </div>
        </div>

        <div className="col-span-3 gap-3 md:ml-3">
          <div className="flex gap-3">
            <DiscordStatus />

            <LatestPost />
          </div>
          {/* <BooksCard /> */}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 gap-y-3 md:grid-cols-6">
        <div className="col-span-2 md:col-span-4 lg:col-span-3">
          {/* <WakatimeStats /> */}
          <GithubStatsCard />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <CatCard />
        </div>
        <div className="col-span-3 md:col-span-6 lg:col-span-2">
          <StacksCard />
        </div>
      </div>

      {/* MBTI Card */}
      <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
        <div className="col-span-3 md:col-span-2">
          <MbtiCard />
        </div>
        <div className="col-span-1 md:col-span-1">
          <ReceiptCard />
        </div>
        <div className="col-span-2 flex items-stretch md:col-span-3">
          <LongTextCard />
        </div>
      </div>
    </div>
  )
}
