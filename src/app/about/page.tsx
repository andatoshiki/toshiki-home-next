import { Metadata } from 'next'

import { AboutMe } from './sections/about-me'
import { Contact } from './sections/contact'
import { Knowledge } from './sections/knowledge'
import { StatisticsGrid } from './sections/statistics'
import { Experience } from './sections/experience'
import { Educational } from './sections/educational'
import { GithubDataProvider } from '~/components/providers/github-data-provider'

import './style.css'

export const metadata: Metadata = {
  title: 'About Me',
  description:
    'Information about who is Mateus Felipe, my knowledge, statistics about me and social links.',
  keywords: ['about', 'social', 'links', 'knowledge']
}

export default function Page() {
  return (
    <div className="content-container m-auto space-y-32">
      <AboutMe />
      <GithubDataProvider>
        <StatisticsGrid />
      </GithubDataProvider>
      <Knowledge />
      <Experience />
      <Educational />
      <Contact />
    </div>
  )
}
