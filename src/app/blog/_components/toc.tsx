'use client'
import React, { ComponentProps, useMemo, useRef, useState } from 'react'
import { List, CaretDown } from '@phosphor-icons/react'

const exampleToc = { url: '', title: '', items: [] as any[] }
type TocEntry = typeof exampleToc

const TocItem = ({
  toc,
  activeUrl,
  registerItemRef,
  ...rest
}: {
  toc: TocEntry
  activeUrl: string
  registerItemRef: (url: string, element: HTMLLIElement | null) => void
} & ComponentProps<'li'>) => (
  <li
    {...rest}
    ref={(element: HTMLLIElement | null) => registerItemRef(toc.url, element)}
  >
    <a
      href={toc.url}
      className={`block transition-colors ${
        activeUrl === toc.url
          ? 'font-semibold text-neutral-800 dark:text-neutral-200'
          : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
      }`}
    >
      {toc.title}
    </a>
    {toc.items.length > 0 && (
      <ol className="space-y-2 pl-0">
        {toc.items.map(childToc => (
          <TocItem
            toc={childToc}
            key={childToc.url}
            activeUrl={activeUrl}
            registerItemRef={registerItemRef}
            className="space-y-2 pl-0"
          />
        ))}
      </ol>
    )}
  </li>
)

interface TocProps {
  toc: TocEntry[]
  mode?: 'collapsible' | 'sidebar'
}

export function Toc({ toc, mode = 'collapsible' }: TocProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeUrl, setActiveUrl] = useState('')
  const [indicator, setIndicator] = useState({
    top: 0,
    height: 0,
    visible: false
  })
  const contentRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const [height, setHeight] = useState('0px')

  const tocUrls = useMemo(() => {
    const urls: string[] = []
    const walk = (entries: TocEntry[]) => {
      for (const entry of entries) {
        urls.push(entry.url)
        if (entry.items.length > 0) walk(entry.items)
      }
    }
    walk(toc)
    return urls
  }, [toc])

  // Animate height on open/close
  React.useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 'px')
    } else {
      setHeight('0px')
    }
  }, [isOpen, toc])

  React.useEffect(() => {
    const updateProgressAndSection = () => {
      const contentElement = document.querySelector(
        '.post-content'
      ) as HTMLElement | null

      if (!contentElement) return

      const rect = contentElement.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const contentTop = scrollY + rect.top
      const viewportHeight = window.innerHeight
      const end = Math.max(
        contentTop + contentElement.scrollHeight - viewportHeight,
        contentTop + 1
      )
      const percent = Math.round(
        ((scrollY - contentTop) / (end - contentTop)) * 100
      )

      setProgress(Math.min(100, Math.max(0, percent)))

      const headings = tocUrls
        .map(url => document.getElementById(url.replace(/^#/, '')))
        .filter((heading): heading is HTMLElement => heading !== null)

      if (headings.length === 0) return

      const threshold = 180
      let currentHeading = headings[0]
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= threshold) {
          currentHeading = heading
        } else {
          break
        }
      }

      const nextActiveUrl = `#${currentHeading.id}`
      setActiveUrl(prev => (prev === nextActiveUrl ? prev : nextActiveUrl))
    }

    updateProgressAndSection()
    window.addEventListener('scroll', updateProgressAndSection, {
      passive: true
    })
    window.addEventListener('resize', updateProgressAndSection)

    return () => {
      window.removeEventListener('scroll', updateProgressAndSection)
      window.removeEventListener('resize', updateProgressAndSection)
    }
  }, [tocUrls])

  React.useEffect(() => {
    const listElement = listRef.current
    const activeElement = itemRefs.current[activeUrl]

    if (!listElement || !activeElement) {
      setIndicator(prev => ({ ...prev, visible: false }))
      return
    }

    const listRect = listElement.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()

    setIndicator({
      top: activeRect.top - listRect.top,
      height: activeRect.height,
      visible: true
    })
  }, [activeUrl, isOpen, tocUrls])

  const registerItemRef = (url: string, element: HTMLLIElement | null) => {
    itemRefs.current[url] = element
  }

  if (toc.length === 0) return null

  const renderList = (listClassName: string) => (
    <ol ref={listRef} className={`relative ${listClassName}`}>
      {indicator.visible ? (
        <span
          className="pointer-events-none absolute -left-2 w-[2px] rounded-full bg-neutral-700/80 transition-all duration-200 dark:bg-neutral-300/80"
          style={{ top: indicator.top, height: indicator.height }}
        />
      ) : null}
      {toc.map(tocItem => (
        <TocItem
          toc={tocItem}
          key={tocItem.url}
          activeUrl={activeUrl}
          registerItemRef={registerItemRef}
          className="relative space-y-2 pl-0"
        />
      ))}
    </ol>
  )

  if (mode === 'sidebar') {
    return (
      <nav className="toc text-[0.85rem] leading-snug text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2 px-2 py-1 font-semibold leading-none">
          <List className="text-xl" />
          <span>{progress}%</span>
        </div>
        {renderList('space-y-2 px-2 py-3')}
      </nav>
    )
  }

  return (
    <nav className="toc text-[0.85rem] leading-snug text-neutral-600 dark:text-neutral-400">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-2 py-1 leading-none transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        <span className="flex items-center gap-2">
          <List className="text-xl" />
          <span className="font-semibold">{progress}%</span>
        </span>
        <CaretDown
          className={`text-xl transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          size="1em"
        />
      </button>
      <div
        ref={contentRef}
        style={{
          height: isOpen ? height : '0px',
          overflow: 'hidden',
          transition: 'height 0.3s ease'
        }}
        aria-hidden={!isOpen}
      >
        {renderList('space-y-2 p-4')}
      </div>
    </nav>
  )
}
