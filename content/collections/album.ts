import { defineCollection, s } from 'velite'
import { slug } from '~/lib/slug'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

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

export const album = defineCollection({
  name: 'Album',
  pattern: 'album/*.mdx',
  schema: s
    .object({
      title: s.string(),
      date: s.isodate().optional(),
      content: s.mdx(),
      raw_content: s.custom().transform((data, { meta }) => meta.content)
    })
    .transform(data => ({
      ...data,
      slug: slug(data.title),
      images: extractImagesFromMarkdown(data.raw_content)
    }))
})
