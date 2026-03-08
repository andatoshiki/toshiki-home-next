import React from 'react'
import Image from 'next/image'

interface MansoryPhotoProps {
  photo: {
    src: string
    alt: string
    width: number
    height: number
    date?: string
    blurDataURL?: string
  }
  width: number
  height: number
  onClick?: () => void
}

export default function MansoryPhoto({
  photo,
  width,
  height,
  onClick
}: MansoryPhotoProps) {
  const [isImageLoading, setImageLoading] = React.useState(true)
  return (
    <div
      className="group relative cursor-pointer overflow-hidden"
      style={{ width, height }}
      onClick={onClick}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 1200px) 100vw, 600px"
        className={`object-cover transition duration-200 group-hover:brightness-75 ${isImageLoading ? 'blur-sm' : ''}`}
        onLoad={() => setImageLoading(false)}
      />
      <span
        className="pointer-events-none absolute bottom-0 left-0 mb-2 ml-2 flex flex-col items-start rounded bg-black/60 px-3 py-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
        style={{ maxWidth: '80%' }}
      >
        {/* Date formatted as 'October 18, 2025' or fallback */}
        <span className="text-[13px] font-semibold text-white">
          {photo.date
            ? new Date(photo.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : ''}
        </span>
        <span className="mt-1 truncate">{photo.alt}</span>
        <span className="mt-1 text-[11px] text-gray-200">
          {photo.height} x {photo.width}
        </span>
      </span>
    </div>
  )
}
