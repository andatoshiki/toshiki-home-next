'use client'
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Download from 'yet-another-react-lightbox/plugins/download'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'

export default function BlogImageLightbox(props) {
  const [open, setOpen] = useState(false)
  const { src, alt, ...rest } = props

  return (
    <figure className="my-6 flex flex-col items-center">
      <span
        onClick={() => setOpen(true)}
        className="cursor-zoom-in"
        style={{ display: 'inline-block' }}
      >
        <img
          src={src}
          alt={alt}
          {...rest}
          style={{ maxWidth: '100%', borderRadius: '0.5rem' }}
        />
      </span>
      {alt ? (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">
          {alt}
        </figcaption>
      ) : null}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src, alt }]}
        plugins={[Download, Slideshow]}
        index={0}
        styles={{
          container: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }}
        render={{
          slide: ({ slide }) => (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <img
                src={slide.src}
                alt={slide.alt || ''}
                style={{
                  maxHeight: '80vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '0.5rem'
                }}
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
    </figure>
  )
}
