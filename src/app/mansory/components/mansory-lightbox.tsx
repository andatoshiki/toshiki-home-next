import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Download from 'yet-another-react-lightbox/plugins/download'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Image from 'next/image'

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
      styles={{
        container: {
          backgroundColor: 'rgba(0,0,0,0.5)'
        }
      }}
      render={{
        slide: ({ slide }) => {
          const img = slide as MansoryLightboxPhoto
          return (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Image
                src={img.src}
                alt={img.alt || ''}
                width={img.width || defaultWidth}
                height={img.height || defaultHeight}
                className="max-h-[80vh] max-w-full object-contain"
              />
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
