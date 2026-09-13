import type { Post } from '#content'

export type TocEntry = Post['toc'][number]

export function flattenToc(toc: TocEntry[]): TocEntry[] {
  return toc.flatMap(entry => [entry, ...flattenToc(entry.items)])
}

export function activeHeadingUrl(
  headings: { url: string; top: number }[],
  offset: number
) {
  let active = headings[0]?.url ?? ''
  for (const heading of headings) {
    if (heading.top > offset) break
    active = heading.url
  }
  return active
}
