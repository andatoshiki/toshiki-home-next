'use client'

import React, { ComponentProps, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react/dist/ssr'

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

  if (toc.length === 0) return null

  return (
    <nav className="toc">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border-b border-neutral-200 bg-neutral-100 p-4 leading-none transition-colors hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      >
        <span>Table of content</span>
        <CaretDown
          className={`text-2xl transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          size="1em"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
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
