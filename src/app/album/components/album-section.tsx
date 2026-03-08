'use client'
import GalleryImages from './gallery-image-grid'
import { format } from 'date-fns'

function formatDate(date: string) {
  try {
    return format(new Date(date), 'MMM dd, yyyy')
  } catch {
    return date
  }
}

interface GalleryClientProps {
  albums: Array<{
    data: any
    galleries: Array<any[]>
  }>
}

export default function GalleryClient({ albums }: GalleryClientProps) {
  const sortedAlbums = albums.sort((a, b) => {
    const dateA = new Date(a.data.date || 0).getTime()
    const dateB = new Date(b.data.date || 0).getTime()
    return dateB - dateA // Newest first
  })

  return (
    <div className="mx-auto max-w-2xl space-y-16 p-4 pt-32">
      {sortedAlbums.map((album, idx) => (
        <section key={idx} className=" first:pt-0 last:pb-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sens text-2xl font-bold">{album.data.title}</h2>
            {album.data.date && (
              <span className="text-sm italic text-neutral-500">
                {formatDate(album.data.date)}
              </span>
            )}
          </div>
          <div className="mb-2">
            {album.galleries &&
              album.galleries.length > 0 &&
              album.galleries.map((images, i) => (
                <GalleryImages key={i} images={images} />
              ))}
          </div>
          {idx !== albums.length - 1 && (
            <hr className="b-0 l-[4px] mr-[4px] mt-12 border-t-[0.1px] border-zinc-700" />
          )}
        </section>
      ))}
    </div>
  )
}
