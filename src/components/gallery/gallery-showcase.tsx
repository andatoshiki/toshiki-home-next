import React from 'react'
import { getGalleryAlbums } from '../../../app/album/utils/album-data'
import GalleryImage from '../../../app/album/components/gallery-image'

// Server component: fetches and displays the 3 most recent album images
export default async function GalleryShowcase() {
  // Fetch all albums (sorted by date descending if possible)
  const albums = await getGalleryAlbums()
  // Flatten all images from all albums, keeping track of album date for sorting
  const allImages: Array<{ src: string; alt: string; date: string }> = []
  for (const album of albums) {
    const date = album.data?.date || ''
    for (const gallery of album.galleries) {
      for (const img of gallery) {
        allImages.push({ src: img.src, alt: img.alt, date })
      }
    }
  }
  // Sort images by album date descending (most recent first)
  allImages.sort((a, b) => (a.date < b.date ? 1 : -1))
  // Take the 3 most recent images
  const images = allImages.slice(0, 3)

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((img, i) => (
        <GalleryImage key={img.src} src={img.src} alt={img.alt} />
      ))}
    </div>
  )
}
