import {
  getAlbumSlugs,
  getAlbumBySlug,
  extractGalleryImages
} from './mdx-pipeline'

export async function getGalleryAlbums() {
  const files = getAlbumSlugs()
  const albums = await Promise.all(
    files.map(async slug => {
      const { content, data } = getAlbumBySlug(slug)
      const galleries = await extractGalleryImages(content)
      return { data, galleries }
    })
  )
  return albums
}
