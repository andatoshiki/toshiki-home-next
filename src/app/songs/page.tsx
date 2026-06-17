import { Metadata } from 'next'
import { SongsPageClient } from './_components/songs-page-client'

export const metadata: Metadata = {
  title: 'Songs',
  description:
    'My latest music activity powered by Last FM. Check out the Daily Songs page for a fresh new recommendation!',
  keywords: ['music', 'songs', 'lastfm', 'listening', 'activity']
}

export default function Page() {
  return <SongsPageClient />
}
