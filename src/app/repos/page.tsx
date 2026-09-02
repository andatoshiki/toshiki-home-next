import { Metadata } from 'next'
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
  return <ReposPageClient />
}
