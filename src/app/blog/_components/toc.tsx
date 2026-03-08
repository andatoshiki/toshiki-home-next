'use client'
import React, { ComponentProps, useRef, useState } from 'react'
import { List, CaretDown } from '@phosphor-icons/react'

const exampleToc = { url: '', title: '', items: [] as any[] }
type TocEntry = typeof exampleToc

const TocItem = ({
  toc,
  ...rest
}: { toc: TocEntry } & ComponentProps<'li'>) => (
  <li {...rest}>
    <a href={toc.url}>{toc.title}</a>
    {toc.items.length > 0 && (
      <ol className="space-y-2">
        {toc.items.map(childToc => (
          <TocItem
            toc={childToc}
            key={childToc.url}
            className="space-y-2 pl-3"
          />
        ))}
      </ol>
    )}
  </li>
)

interface TocProps {
  toc: TocEntry[]
}

export function Toc({ toc }: TocProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState('0px')

  // Animate height on open/close
  React.useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 'px')
    } else {
      setHeight('0px')
    }
  }, [isOpen, toc])

  if (toc.length === 0) return null

  return (
    <nav className="toc">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border-b border-neutral-200 bg-neutral-100 p-4 leading-none transition-colors hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      >
        <span className="flex items-center gap-2">
          <List className="text-2xl" />
          <span className="font-semibold">Table of content</span>
        </span>
        <CaretDown
          className={`text-2xl transition-transform duration-200 ${
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
        <ol className="space-y-2 p-4">
          {toc.map(tocItem => (
            <TocItem toc={tocItem} key={tocItem.url} className="space-y-2" />
          ))}
        </ol>
      </div>
    </nav>
  )
}
