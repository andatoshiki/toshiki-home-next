'use client'
// import '../gallery-zoom.css'
import * as React from 'react'
import Image from 'next/image'
import { Image as ImageIcon } from '@phosphor-icons/react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface GalleryImageProps {
  src: string
  alt: string
  className?: string
}

const GalleryImage = ({ src, alt, className }: GalleryImageProps) => {
  const [loaded, setLoaded] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  return (
    <figure className="flex flex-col items-center">
      <span className="relative block w-full" style={{ aspectRatio: '4/3' }}>
        {!loaded && (
          <span className="absolute inset-0 z-0 flex animate-pulse items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
          </span>
        )}
        <Zoom>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            draggable={false}
            className={`absolute m-0 h-full w-full max-w-none cursor-pointer rounded-lg object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'pointer-events-none opacity-0'} z-10`}
            style={{ borderRadius: '0.5rem' }}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(false)}
          />
        </Zoom>
      </span>
      <figcaption className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
        <ImageIcon size={16} weight="duotone" className="inline-block" />
        {alt}
      </figcaption>
    </figure>
  )
}
export default GalleryImage
