import { Metadata } from 'next'
import MansoryGalleryClient from './components/mansory-gallery-client'
import { mansory } from '#content'

export const metadata: Metadata = {
  title: 'Mansory Gallery',
  description:
    'A modular, multi-file mansory gallery with image metadata, blur-up loading, and hover captions.',
  openGraph: {
    title: 'Mansory Gallery',
    description:
      'A modular, multi-file mansory gallery with image metadata, blur-up loading, and hover captions.'
  }
}

const DEFAULT_WIDTH = 600
const DEFAULT_HEIGHT = 400

const photos = mansory
  .flatMap(item => item.images)
  .map((img: any) => ({
    src: img.src,
    alt: img.alt,
    width: img.width || DEFAULT_WIDTH,
    height: img.height || DEFAULT_HEIGHT,
    blurDataURL: img.blurDataURL,
    date: img.date
  }))

export default function MansoryGalleryPage() {
  return (
    <div className="content-vertical-spaces content-container m-auto space-y-10 md:space-y-14">
      <MansoryGalleryClient
        photos={photos}
        defaultWidth={DEFAULT_WIDTH}
        defaultHeight={DEFAULT_HEIGHT}
      />
    </div>
  )
}
