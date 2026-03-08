import { AboutMe } from './_components/about-me'
import { Grid } from './_components/grid'
import { MainTitle } from './_components/main-title'
import { ExploreButton } from './_components/explore-button'
import { getAllBlogPosts } from '~/components/heatmap/get-all-blogs'
import { BlogHeatmap } from '~/components/heatmap/heatmap'
import { PostList } from '~/components/post-list'
import { HeroPagesCards } from '~/components/ui/hero-cards'
import GalleryShowcase from '~/components/ui/gallery/gallery-showcase'
import { HeroTitle } from '~/components/ui/section-title'
import { HeroMeCards } from '~/components/ui/hero-cards'
import LeetCodeHeatmap from '~/components/heatmap/leetcode-heatmap'
// import WakatimeHeatmap from '~/components/heatmap/github-heatmap'
import GithubHeatmap from '~/components/heatmap/github-heatmap'
import WakatimeHeatmap from '~/components/heatmap/wakatime-heatmap'

export default function Page() {
  return (
    <div className="content-container content-vertical-spaces m-auto space-y-20 overflow-hidden">
      <div className="flex flex-col items-center gap-24">
        <MainTitle />
        <ExploreButton />
      </div>

      <div className="gap-3">
        <HeroTitle className="pb-3">Pages</HeroTitle>
        <HeroPagesCards />
      </div>
      <div className="gap-3">
        <HeroTitle className="pb-3">ME</HeroTitle>
        <HeroMeCards />
      </div>
      <AboutMe />
      {/* <GalleryShowcase /> */}
      <Grid />
      {/* <LeetCodeHeatmap />
      <WakatimeHeatmap /> */}
      {/* <GithubHeatmap /> */}
    </div>
  )
}
