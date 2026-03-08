import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journey',
  description:
    'An interactive globe showcasing places I have visited, lived in, and dream of exploring.',
  keywords: [
    'travel',
    'journey',
    'map',
    'globe',
    'visited',
    'places',
    'wanderlust'
  ]
}

export default function JourneyLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
