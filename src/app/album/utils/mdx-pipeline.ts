// Extract gallery image metadata from MDX for React rendering
import rehypeParse from 'rehype-parse'
import { visit } from 'unist-util-visit'

export async function extractGalleryImages(content: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypeGallery)
    .use(rehypeStringify)
    .process(content)
  const html = String(file)
  // Parse the HTML to find <gallery-images> nodes
  const ast = unified().use(rehypeParse, { fragment: true }).parse(html)
  const galleries: Array<
    Array<{
      src: string
      alt: string
      width?: number | null
      height?: number | null
    }>
  > = []
  visit(ast, { type: 'element', tagName: 'gallery-images' }, (node: any) => {
    if (node.properties && node.properties.images) {
      try {
        const imgs = JSON.parse(node.properties.images)
        galleries.push(imgs)
      } catch {}
    }
  })
  return galleries
}
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { rehypeGallery } from './album-rehype'

export function getAlbumSlugs() {
  const dir = path.join(process.cwd(), 'content/album')
  return fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
}

export function getAlbumBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'content/album', slug)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { content, data } = matter(raw)
  return { content, data }
}

export async function renderAlbumMdx(content: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypeGallery)
    .use(rehypeStringify)
    .process(content)
  return String(file)
}
