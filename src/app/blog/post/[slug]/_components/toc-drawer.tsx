'use client'

import {
  GithubLogo,
  House,
  List,
  Rss,
  TreeStructure,
  X
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Toc } from '../../../_components/toc'

const exampleToc = { url: '', title: '', items: [] as any[] }
type TocEntry = typeof exampleToc

interface TocDrawerProps {
  toc: TocEntry[]
}

export function TocDrawer({ toc }: TocDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  // Auto-close when viewport expands to sidebar-TOC breakpoint (≥ 1320px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1320px)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false)
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (toc.length === 0) return null

  return (
    <>
      {/* Trigger button — visible only when sidebar TOC is hidden (< 1320px) */}
      {/* Sits to the left of the back-to-top button at the same bottom-right row */}
      <button
        onClick={() => setIsOpen(true)}
        title="Table of contents"
        aria-label="Open table of contents"
        className="fixed bottom-7 left-7 flex items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 min-[1320px]:hidden"
      >
        <List className="text-2xl" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[125] bg-black/20 transition-opacity duration-300 dark:bg-black/40 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in drawer from the left */}
      <div
        className={`fixed inset-y-0 left-0 z-[126] flex w-72 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-neutral-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Table of contents"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
            On this page
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close table of contents"
            className="rounded p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Close drawer when a TOC link is clicked */}
        <div
          className="flex-1 overflow-y-auto p-2"
          onClick={e => {
            if ((e.target as HTMLElement).closest('a')) setIsOpen(false)
          }}
        >
          <Toc toc={toc} mode="sidebar" />
        </div>

        {/* Footer quick links */}
        <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              {
                href: '/',
                icon: <House size={20} />,
                label: 'Home',
                external: false
              },
              {
                href: 'https://github.com/andatoshiki/toshiki-home-next',
                icon: <GithubLogo size={20} />,
                label: 'GitHub',
                external: true
              },
              {
                href: '/blog/feed',
                icon: <Rss size={20} />,
                label: 'RSS',
                external: true
              },
              {
                href: '/sitemap.xml',
                icon: <TreeStructure size={20} />,
                label: 'Sitemap',
                external: true
              }
            ].map(({ href, icon, label, external }) =>
              external ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="flex items-center justify-center rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                >
                  {icon}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  title={label}
                  className="flex items-center justify-center rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                >
                  {icon}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
