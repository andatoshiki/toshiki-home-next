import { defineCollection, s } from 'velite'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import probe from 'probe-image-size'

function extractImagesFromMarkdown(markdown: string) {
  const images: Array<{ src: string; alt: string }> = []
  const tree = unified().use(remarkParse).parse(markdown)
  function visit(node: any) {
    if (node.type === 'image') {
      images.push({ src: node.url, alt: node.alt || '' })
    }
    if (node.children) {
      node.children.forEach(visit)
    }
  }
  visit(tree)
  return images
}

async function getImageDimensions(src: string) {
  try {
    const result = await probe(src)
    return { width: result.width, height: result.height }
  } catch {
    return { width: 600, height: 400 } // fallback
  }
}

export const mansory = defineCollection({
  name: 'Mansory',
  pattern: 'mansory/*.mdx', // wildcard matching pattern for all files under mansory dir
  schema: s
    .object({
      content: s.mdx(),
      date: s.isodate().optional(),
      raw_content: s.custom().transform((data, { meta }) => meta.content)
    })
    .transform(async (data, { meta }) => {
      // extract images and attach date from frontmatter to each image
      const frontmatter = meta.frontmatter || {}
      const images = await Promise.all(
        extractImagesFromMarkdown(data.raw_content || '').map(async img => {
          const { width, height } = await getImageDimensions(img.src)
          return {
            ...img,
            width,
            height,
            date: data.date || null // <-- use data.date
          }
        })
      )
      return { images }
    })
})
