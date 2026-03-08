'use client'

import React, { useState } from 'react'
import MansoryGallery from './mansory-gallery'
import MansoryLightbox from './mansory-lightbox'
import { Title } from '~/components/title'

interface MansoryGalleryClientProps {
  photos: Array<{
    src: string
    alt: string
    width: number
    height: number
    blurDataURL?: string
    date?: string
  }>
  defaultWidth?: number
  defaultHeight?: number
}

export default function MansoryGalleryClient({
  photos,
  defaultWidth = 600,
  defaultHeight = 400
}: MansoryGalleryClientProps) {
  const [index, setIndex] = useState(-1)
  return (
    <main className="mx-auto max-w-5xl px-2 py-8">
      <Title text="Mansory Gallery" />
      <MansoryGallery photos={photos} onPhotoClick={setIndex} />
      <MansoryLightbox
        photos={photos}
        index={index}
        onClose={() => setIndex(-1)}
        defaultWidth={defaultWidth}
        defaultHeight={defaultHeight}
      />
    </main>
  )
}
