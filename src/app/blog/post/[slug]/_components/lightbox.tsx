'use client'
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Download from 'yet-another-react-lightbox/plugins/download'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'

export default function BlogImageLightbox(props) {
  const [open, setOpen] = useState(false)
  const { src, alt, style, width, ...rest } = props

  return (
    <figure className="my-6 flex flex-col items-center">
      <span
        onClick={() => setOpen(true)}
        className="cursor-zoom-in"
        style={{ display: 'block', width: '100%' }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          {...rest}
          style={{
            width: width ?? '100%',
            maxWidth: width ? '100%' : '48rem',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            borderRadius: '0.5rem',
            ...style
          }}
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
