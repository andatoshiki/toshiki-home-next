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
import dynamic from 'next/dynamic'

const LightboxViewer = dynamic(
  () => import('./lightbox-viewer').then(module => module.LightboxViewer),
  { ssr: false }
)

interface BlogImageLightboxProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
}

export interface BlogLightboxSlide {
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
      {gallery ? (
        <LightboxViewer
          slides={gallery.slides}
          index={gallery.index}
          onClose={() => setGallery(null)}
        />
      ) : null}
    </BlogLightboxContext.Provider>
  )
}

export default function BlogImageLightbox(props: BlogImageLightboxProps) {
  const gallery = useContext(BlogLightboxContext)
  const imageId = useId()
  const { src, alt, style, width, loading = 'lazy', ...rest } = props

  useEffect(() => {
    if (!gallery || !src) return

    return gallery.registerSlide({ id: imageId, src, alt })
  }, [alt, gallery, imageId, src])

  return (
    <figure className="my-6 flex flex-col items-center">
      <button
        type="button"
        onClick={() => gallery?.openSlide(imageId)}
        aria-label={alt ? `Open image: ${alt}` : 'Open image'}
        className="cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400"
        style={{ display: 'block', width: '100%' }}
      >
        {/* MDX images can be remote and do not consistently provide dimensions. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ''}
          width={width}
          loading={loading}
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
      </button>
      {alt ? (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  )
}
