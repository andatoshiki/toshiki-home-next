import { MasonryPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/masonry.css'
import MansoryPhoto from './mansory-photo'

interface MansoryGalleryProps {
  photos: Array<{
    src: string
    alt: string
    width: number
    height: number
    blurDataURL?: string
  }>
  onPhotoClick: (index: number) => void
}

export default function MansoryGallery({
  photos,
  onPhotoClick
}: MansoryGalleryProps) {
  return (
    <MasonryPhotoAlbum
      photos={photos}
      columns={containerWidth => {
        if (containerWidth < 600) return 2
        if (containerWidth < 900) return 3
        return 3
      }}
      spacing={5}
      padding={0}
      render={{
        photo: ({ onClick }, { photo, width, height, index }) => (
          <MansoryPhoto
            photo={photo}
            width={width}
            height={height}
            onClick={() => onPhotoClick(index)}
          />
        )
      }}
    />
  )
}
