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
import type { HTMLAttributes } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Toc, type TocEntry } from '../../../_components/toc'

interface TocDrawerProps {
  toc: TocEntry[]
  activeUrl?: string
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const inertElementProps = {
  inert: ''
} as unknown as HTMLAttributes<HTMLDivElement>

export function TocDrawer({ toc, activeUrl }: TocDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const dialog = dialogRef.current
    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusableElements = dialog
      ? Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      : []
    focusableElements[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        return
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyOverflow
      triggerRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1320px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (toc.length === 0) return null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        title="Table of contents"
        aria-label="Open table of contents"
        aria-controls="blog-toc-drawer"
        aria-expanded={isOpen}
        className="fixed bottom-7 left-7 flex touch-manipulation items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-400 min-[1320px]:hidden"
      >
        <List aria-hidden="true" className="text-2xl" />
      </button>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden={!isOpen}
        aria-label="Close table of contents"
        className={`fixed inset-0 z-[125] bg-black/20 transition-opacity duration-300 motion-reduce:transition-none dark:bg-black/40 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        ref={dialogRef}
        id="blog-toc-drawer"
        className={`fixed inset-y-0 left-0 z-[126] flex w-72 flex-col overscroll-contain bg-white shadow-xl transition-transform duration-300 ease-in-out motion-reduce:transition-none dark:bg-neutral-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal={isOpen ? 'true' : undefined}
        aria-hidden={!isOpen}
        aria-label="Table of contents"
        {...(!isOpen ? inertElementProps : {})}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
            On this page
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close table of contents"
            className="rounded p-1 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-400"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain p-2"
          onClick={event => {
            if ((event.target as HTMLElement).closest('a')) setIsOpen(false)
          }}
        >
          <Toc toc={toc} activeUrl={activeUrl} />
        </div>

        <nav
          aria-label="Blog shortcuts"
          className="shrink-0 border-t border-neutral-200 dark:border-neutral-800"
        >
          <div className="flex items-center justify-around px-2 py-2">
            <Link
              href="/"
              aria-label="Home"
              title="Home"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 dark:focus-visible:ring-neutral-400"
            >
              <House aria-hidden="true" size={20} />
            </Link>
            <a
              href="https://github.com/andatoshiki/toshiki-home-next"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="flex items-center justify-center rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 dark:focus-visible:ring-neutral-400"
            >
              <GithubLogo aria-hidden="true" size={20} />
            </a>
            <Link
              href="/blog/feed"
              aria-label="RSS feed"
              title="RSS"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 dark:focus-visible:ring-neutral-400"
            >
              <Rss aria-hidden="true" size={20} />
            </Link>
            <Link
              href="/sitemap.xml"
              aria-label="Sitemap"
              title="Sitemap"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 dark:focus-visible:ring-neutral-400"
            >
              <TreeStructure aria-hidden="true" size={20} />
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
