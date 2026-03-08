import { getGalleryAlbums } from './album-data'
import GalleryClient from '../components/album-section'

export default async function AlbumGallery() {
  const albums = await getGalleryAlbums()
  if (!albums.length) return <div>No albums found.</div>
  return <GalleryClient albums={albums} />
}
