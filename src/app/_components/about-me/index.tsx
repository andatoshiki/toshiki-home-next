import { Introduction } from './introduction'
import { MakingCard } from './making-card'
import MastodonRssCard from './mastodon-rss-card'
import { Grid } from '../grid/index'

export function AboutMe() {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:gap-3">
      <Introduction />
      <div className="relative">
        <div className="h-fit space-y-7 md:sticky md:top-24 md:w-[23rem]">
          <MakingCard />
          {/* <MastodonRssCard /> */}
        </div>
      </div>
    </div>
  )
}
