import React from 'react'
import { BlockCard } from '~/components/ui/cards/block-card'
import { PagesCardProps, PagesCard } from '~/components/ui/cards/pages-card'
import {
  MusicNote,
  BookOpen,
  FolderOpen,
  GitBranch,
  Heart,
  Users,
  IdentificationBadge,
  CurrencyBtc,
  ChartPie,
  ChartScatter,
  FinnTheHuman,
  HouseLine,
  GlobeHemisphereEast
} from '@phosphor-icons/react/dist/ssr'

export function HeroPagesCards() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <PagesCard
        title="Blog"
        description="Real life stories anecdotes & developmental journeys for embarking your inspirations."
        icon={<BookOpen size="28" />}
        href="/blog"
      />

      <PagesCard
        title="Projects"
        description="View all my notable public projects with illustrations and descriptions for better insights."
        icon={<FolderOpen size="28" />}
        href="/projects"
      />

      <PagesCard
        title="Repositories"
        description="View all my public repositories on GitHub and discover particular ones to your interests for collab."
        icon={<GitBranch size="28" />}
        href="/repos"
      />

      <PagesCard
        title="Donate"
        description="Support our mission and make a difference by contributing to our future developments and researches with a tip."
        icon={<CurrencyBtc size="28" />}
        href="/donation"
      />
    </div>
  )
}

export function HeroMeCards() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <PagesCard
        title="About"
        description="Explore the journey of a dedicated student developer and designer, driven by passion for innovation."
        icon={<IdentificationBadge size="28" />}
        href="/about"
      />

      <PagesCard
        title="Songs"
        description="Songs I listen to on a daily bases with a truncated statistical report of listening history via last.fm API."
        icon={<MusicNote size="28" />}
        href="/songs"
      />

      <PagesCard
        title="Friends"
        description="Curated selection of trusted affiliate links, handpicked friends and virtual companions I met online/physically with values and quality."
        icon={<Users size="28" />}
        href="/friends"
      />

      <PagesCard
        title="Contacts"
        description="Perceive the intents to contact me for communication? Check all platform applied to your favor for contacts."
        icon={<Heart size="28" />}
        href="/donation"
      />

      <PagesCard
        title="Statistics"
        description="A quick peek at some fun stats and milestones—see what I’ve been up to lately, all in one place!"
        icon={<ChartScatter size="28" />}
        href="/about/statistics"
      />

      <PagesCard
        title="Library"
        description="A quick peek at some fun stats and milestones—see what I’ve been up to lately, all in one place!"
        icon={<FinnTheHuman size="28" />}
        href="/library"
      />

      <PagesCard
        title="Room"
        description="Explore interactive 3D visualization of my room recreated with blender in 3D!"
        icon={<HouseLine size="28" />}
        href="/room"
      />

      <PagesCard
        title="Journey"
        description="Explore the places I've visited and lived around the world on an interactive globe map."
        icon={<GlobeHemisphereEast size="28" />}
        href="/journey"
      />
    </div>
  )
}

// Example showing BlockCards without links (no hover effects)
export function PagesBlockCardsExampleNoLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BlockCard>
        <BlockCard.Icon>
          <BookOpen size="28" />
        </BlockCard.Icon>
        <BlockCard.Content>
          <BlockCard.Title>Blog</BlockCard.Title>
          <BlockCard.Description>
            This BlockCard has no link, so no hover effects.
          </BlockCard.Description>
        </BlockCard.Content>
      </BlockCard>
    </div>
  )
}

// alternative usage without compound components
export function PagesBlockCardsExampleSimple() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BlockCard>
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-2xl font-semibold text-neutral-500 dark:bg-neutral-900">
          <BookOpen size="28" />
        </div>
        <div className="flex min-w-0 flex-col">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Blog
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Real life stories anecdotes & developmental journeys for embarking
            your inspirations.
          </p>
        </div>
      </BlockCard>
    </div>
  )
}
