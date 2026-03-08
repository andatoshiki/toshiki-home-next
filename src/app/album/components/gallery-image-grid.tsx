'use client'
import * as React from 'react'
import GalleryImage from './gallery-image'

interface GalleryImagesProps {
  images: Array<{
    src: string
    alt: string
    width?: number | null
    height?: number | null
  }>
}

const GalleryImages = ({ images }: GalleryImagesProps) => {
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img, i) => (
        <GalleryImage key={i} src={img.src} alt={img.alt} />
      ))}
    </div>
  )
}

export default GalleryImages
