'use client'

import { useEffect, useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Download from 'yet-another-react-lightbox/plugins/download'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'

interface MansoryLightboxPhoto {
  src: string
  alt: string
  date?: string
  width?: number
  height?: number
}

interface MansoryLightboxProps {
  photos: MansoryLightboxPhoto[]
  index: number
  onClose: () => void
  defaultWidth?: number
  defaultHeight?: number
}

export default function MansoryLightbox({
  photos,
  index,
  onClose,
  defaultWidth = 600,
  defaultHeight = 400
}: MansoryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(index)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [loadedBytes, setLoadedBytes] = useState(0)
  const [totalBytes, setTotalBytes] = useState<number | null>(null)

  useEffect(() => {
    setCurrentIndex(index)
  }, [index])

  const currentPhoto = useMemo(
    () => (currentIndex >= 0 ? photos[currentIndex] : null),
    [photos, currentIndex]
  )

  useEffect(() => {
    if (!currentPhoto) return
    let mounted = true
    let objectUrl: string | null = null

    setLoadedSrc(null)
    setIsImageLoading(true)
    setLoadedBytes(0)
    setTotalBytes(null)

    const xhr = new XMLHttpRequest()
    xhr.open('GET', currentPhoto.src, true)
    xhr.responseType = 'blob'

    xhr.onprogress = event => {
      if (!mounted) return
      setLoadedBytes(event.loaded)
      setTotalBytes(event.lengthComputable ? event.total : null)
    }

    xhr.onload = () => {
      if (!mounted) return
      if (xhr.status >= 200 && xhr.status < 300) {
        objectUrl = URL.createObjectURL(xhr.response)
        setLoadedSrc(objectUrl)
      } else {
        setLoadedSrc(currentPhoto.src)
      }
      setIsImageLoading(false)
    }

    xhr.onerror = () => {
      if (!mounted) return
      setLoadedSrc(currentPhoto.src)
      setIsImageLoading(false)
    }

    xhr.send()

    return () => {
      mounted = false
      xhr.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [currentPhoto?.src])

  const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    const exponent = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    )
    const value = bytes / 1024 ** exponent
    return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`
  }

  return (
    <Lightbox
      open={index >= 0}
      close={onClose}
      slides={photos.map(img => ({
        src: img.src,
        alt: img.alt,
        date: img.date,
        width: img.width,
        height: img.height
      }))}
      plugins={[Download, Slideshow]}
      index={index}
      on={{
        view: ({ index: viewedIndex }) => {
          setCurrentIndex(viewedIndex)
        }
      }}
      styles={{
        container: {
          backgroundColor: 'rgba(0,0,0,0.5)'
        }
      }}
      render={{
        slide: ({ slide, offset }) => {
          const img = slide as MansoryLightboxPhoto
          const isActiveSlide = offset === 0 && currentPhoto?.src === img.src
          const shouldShowLoader = isActiveSlide && isImageLoading
          const progressText = totalBytes
            ? `${formatBytes(loadedBytes)} / ${formatBytes(totalBytes)}`
            : `${formatBytes(loadedBytes)} loaded`
          const resolvedSrc =
            isActiveSlide && loadedSrc
              ? loadedSrc
              : isActiveSlide
                ? 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                : img.src

          return (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="relative">
                {shouldShowLoader && (
                  <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-black/65 px-3 py-2 text-white backdrop-blur-sm">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span className="text-sm font-medium">{progressText}</span>
                  </div>
                )}
                <img
                  src={resolvedSrc}
                  alt={img.alt || ''}
                  width={img.width || defaultWidth}
                  height={img.height || defaultHeight}
                  className={`max-h-[80vh] max-w-full rounded-md object-contain transition-opacity duration-300 ${
                    shouldShowLoader ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </div>
              <div className="mt-4 text-center text-base text-white">
                {img.alt}
                <br />
                <span>
                  {img.date
                    ? `${new Date(img.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} • `
                    : ''}
                  {img.height} x {img.width}
                </span>
              </div>
            </div>
          )
        }
      }}
    />
  )
}
