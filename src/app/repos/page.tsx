import { Metadata } from 'next'
import { GithubDataProvider } from '~/components/providers/github-data-provider'
import { ReposPageClient } from './_components/repos-page-client'

export const metadata: Metadata = {
  title: 'Repositories',
  description: 'My public projects on GitHub.',
  openGraph: {
    title: 'Repositories',
    description: 'My public projects on GitHub.'
  }
}

export default function ReposPage() {
  return (
    <GithubDataProvider>
      <ReposPageClient />
    </GithubDataProvider>
  )
}
