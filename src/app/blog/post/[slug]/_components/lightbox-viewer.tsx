'use client'

import Lightbox from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import 'yet-another-react-lightbox/styles.css'
import type { BlogLightboxSlide } from './lightbox'

interface LightboxViewerProps {
  slides: BlogLightboxSlide[]
  index: number
  onClose: () => void
}

export function LightboxViewer({
  slides,
  index,
  onClose
}: LightboxViewerProps) {
  return (
    <Lightbox
      open
      close={onClose}
      slides={slides}
      plugins={[Download, Slideshow]}
      index={index}
      styles={{
        container: {
          backgroundColor: 'rgba(0,0,0,0.5)'
        }
      }}
      render={{
        slide: ({ slide }) => (
          <div className="flex h-full w-full flex-col items-center justify-center">
            {/* The lightbox must display the source asset at its natural ratio. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt || ''}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
            {slide.alt ? (
              <div className="mt-4 text-center text-base text-white">
                {slide.alt}
              </div>
            ) : null}
          </div>
        )
      }}
    />
  )
}
