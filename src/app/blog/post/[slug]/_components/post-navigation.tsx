'use client'

import { useEffect, useMemo, useState } from 'react'
import { Toc, type TocEntry } from '../../../_components/toc'
import { TocDrawer } from './toc-drawer'
import { TopButton } from './top-button'

function flattenTocUrls(toc: TocEntry[]) {
  const urls: string[] = []

  const visit = (entries: TocEntry[]) => {
    for (const entry of entries) {
      urls.push(entry.url)
      if (entry.items.length > 0) visit(entry.items)
    }
  }

  visit(toc)
  return urls
}

export function PostNavigation({ toc }: { toc: TocEntry[] }) {
  const tocUrls = useMemo(() => flattenTocUrls(toc), [toc])
  const [activeUrl, setActiveUrl] = useState(tocUrls[0] ?? '')

  useEffect(() => {
    const headings = tocUrls
      .map(url => document.getElementById(url.replace(/^#/, '')))
      .filter((heading): heading is HTMLElement => heading !== null)

    if (headings.length === 0) return

    const visibleHeadingIds = new Set<string>()
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleHeadingIds.add(entry.target.id)
          } else {
            visibleHeadingIds.delete(entry.target.id)
          }
        }

        const nextHeading = headings.find(heading =>
          visibleHeadingIds.has(heading.id)
        )

        if (nextHeading) setActiveUrl(`#${nextHeading.id}`)
      },
      {
        rootMargin: '-160px 0px -70% 0px',
        threshold: 0
      }
    )

    for (const heading of headings) observer.observe(heading)
    return () => observer.disconnect()
  }, [tocUrls])

  if (toc.length === 0) return null

  return (
    <>
      <aside className="absolute right-full top-0 z-10 mr-[calc((100vw-78rem)/4)] hidden h-full w-52 min-[1320px]:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain pr-2">
          <Toc toc={toc} activeUrl={activeUrl} />
        </div>
      </aside>
      <TopButton />
      <TocDrawer toc={toc} activeUrl={activeUrl} />
    </>
  )
}
