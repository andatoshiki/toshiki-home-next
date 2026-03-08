import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'

// Use Tailwind grid classes directly for the gallery and add rounded-lg to images
export const rehypeGallery: Plugin = () => tree => {
  visit(
    tree,
    { type: 'element', tagName: 'p' },
    (node: any, index: number, parent: any) => {
      if (!parent || typeof index !== 'number') return
      // Only wrap if all children are <img>, <br>, or whitespace
      const isGallery = node.children.every(
        (child: any) =>
          (child.type === 'element' &&
            (child.tagName === 'img' || child.tagName === 'br')) ||
          (child.type === 'text' &&
            (child.value.trim() === '' || child.value.trim() === '\n'))
      )
      if (!isGallery) return
      // Only images as children
      const images = node.children.filter(
        (child: any) => child.type === 'element' && child.tagName === 'img'
      )
      if (images.length === 0) return
      // Output a custom <gallery-images> node with image metadata for React
      const imagesMeta = images.map((img: any) => ({
        src: img.properties.src,
        alt: img.properties.alt || '',
        width: img.properties.width || null,
        height: img.properties.height || null
      }))
      const galleryNode = {
        type: 'element',
        tagName: 'gallery-images',
        properties: {
          images: JSON.stringify(imagesMeta)
        },
        children: []
      }
      parent.children.splice(index, 1, galleryNode)
      return [null, index]
    }
  )
}
