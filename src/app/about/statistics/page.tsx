import { Metadata } from 'next'
import {
  GithubLogo,
  LastfmLogo,
  PencilLine,
  Terminal,
  Timer
} from '@phosphor-icons/react/dist/ssr'
import { Title } from '~/components/title'

import { GithubDashboard } from './_components/github-dashboard'
import { LastFmDashboard } from './_components/lastfm-dashboard'
import { WritingDashboard } from './_components/writing-dashboard'
import { WakapiDashboard } from './_components/wakapi-dashboard'
import { LeetcodeDashboard } from './_components/leetcode-dashboard'
import { RenderDate } from './_components/date'

export const metadata: Metadata = {
  title: 'Statistics',
  description:
    'Updated statistics data about me and my tastes. Github, Last.fm, and other things...',
  keywords: ['about', 'statistics', 'data']
}

export default function Page() {
  const date = new Date()

  return (
    <div className="content-container m-auto space-y-16">
      <Title text="Statistics" description={<RenderDate date={date} />} />
      <div className="space-y-5">
        <div className="flex w-full items-center justify-center gap-2 text-3xl font-semibold text-[#333] dark:text-[#f5f5f5] md:justify-start">
          <h2>Writing</h2>
          <PencilLine size="1em" weight="duotone" />
        </div>
        <WritingDashboard />
      </div>
      <div className="space-y-5">
        <div className="flex w-full items-center justify-center gap-2 text-3xl font-semibold text-[#333] dark:text-[#f5f5f5] md:justify-start">
          <h2>Github</h2>
          <GithubLogo size="1em" weight="duotone" />
        </div>
        <GithubDashboard />
      </div>
      <div className="space-y-5">
        <div className="flex w-full items-center justify-center gap-2 text-3xl font-semibold text-[#f89f1b] lg:justify-start">
          <h2>LeetCode</h2>
          <Terminal size="1em" weight="duotone" />
        </div>
        <LeetcodeDashboard />
      </div>
      <div className="space-y-5">
        <div className="flex w-full items-center justify-center gap-2 text-3xl font-semibold text-[#3b82f6] lg:justify-start">
          <h2>Wakapi</h2>
          <Timer size="1em" weight="duotone" />
        </div>
        <WakapiDashboard />
      </div>
      <div className="space-y-5">
        <div className="flex w-full items-center justify-center gap-2 text-3xl font-semibold text-[#d51007] lg:justify-start">
          <h2>Last.fm</h2>
          <LastfmLogo size="1em" weight="duotone" />
        </div>
        <LastFmDashboard />
      </div>
      {/* <CdLinks /> */}
    </div>
  )
}
