'use client'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Download from 'yet-another-react-lightbox/plugins/download'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'

interface BlogImageLightboxProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
}

interface BlogLightboxSlide {
  id: string
  src: string
  alt?: string
}

interface BlogLightboxContextValue {
  openSlide: (id: string) => void
  registerSlide: (slide: BlogLightboxSlide) => () => void
}

interface BlogLightboxGalleryProps {
  children: React.ReactNode
}

const BlogLightboxContext = createContext<BlogLightboxContextValue | null>(null)

export function BlogLightboxGallery({ children }: BlogLightboxGalleryProps) {
  const registeredSlides = useRef(new Map<string, BlogLightboxSlide>())
  const [gallery, setGallery] = useState<{
    slides: BlogLightboxSlide[]
    index: number
  } | null>(null)

  const registerSlide = useCallback((slide: BlogLightboxSlide) => {
    registeredSlides.current.set(slide.id, slide)

    return () => {
      registeredSlides.current.delete(slide.id)
    }
  }, [])

  const openSlide = useCallback((id: string) => {
    const slides = Array.from(registeredSlides.current.values())
    const index = slides.findIndex(slide => slide.id === id)

    if (index >= 0) setGallery({ slides, index })
  }, [])

  const contextValue = useMemo(
    () => ({ openSlide, registerSlide }),
    [openSlide, registerSlide]
  )

  return (
    <BlogLightboxContext.Provider value={contextValue}>
      {children}
      <Lightbox
        open={gallery !== null}
        close={() => setGallery(null)}
        slides={gallery?.slides ?? []}
        plugins={[Download, Slideshow]}
        index={gallery?.index ?? 0}
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
    </BlogLightboxContext.Provider>
  )
}

export default function BlogImageLightbox(props: BlogImageLightboxProps) {
  const gallery = useContext(BlogLightboxContext)
  const imageId = useId()
  const { src, alt, style, width, ...rest } = props

  useEffect(() => {
    if (!gallery || !src) return

    return gallery.registerSlide({ id: imageId, src, alt })
  }, [alt, gallery, imageId, src])

  return (
    <figure className="my-6 flex flex-col items-center">
      <span
        onClick={() => gallery?.openSlide(imageId)}
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
    </figure>
  )
}
