import { useEffect, useState } from 'react'
import { activeHeadingUrl, type TocEntry } from '../_lib/toc'

export function useActiveHeading(entries: TocEntry[], enabled: boolean) {
  const [activeUrl, setActiveUrl] = useState('')

  useEffect(() => {
    if (!enabled) return

    const headings = entries.flatMap(entry => {
      const element = document.getElementById(entry.url.slice(1))
      return element ? [{ url: entry.url, element }] : []
    })
    if (headings.length === 0) return

    let frame = 0
    const update = () => {
      frame = 0
      const offset =
        parseFloat(getComputedStyle(headings[0].element).scrollMarginTop) || 0
      setActiveUrl(
        activeHeadingUrl(
          headings.map(({ url, element }) => ({
            url,
            top: element.getBoundingClientRect().top
          })),
          offset + 1
        )
      )
    }
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    // Evaluate position after jumps too: headings can skip an observer's narrow
    // intersection band during fast scrolling or browser history restoration.
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    const article = document.querySelector('.post-content')
    if (article) resizeObserver.observe(article)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('hashchange', scheduleUpdate)
    window.addEventListener('pageshow', scheduleUpdate)
    update()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('hashchange', scheduleUpdate)
      window.removeEventListener('pageshow', scheduleUpdate)
    }
  }, [enabled, entries])

  return entries.some(entry => entry.url === activeUrl)
    ? activeUrl
    : entries[0]?.url ?? ''
}
