'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties
} from 'react'
import { cn } from '~/lib/utils'
import { useActiveHeading } from '../_hooks/use-active-heading'
import { flattenToc, type TocEntry } from '../_lib/toc'
import styles from './toc.module.css'

interface ExpandedTocItemProps {
  toc: TocEntry
  activeUrl?: string
  isRevealed: boolean
  depth?: number
}

function ExpandedTocItem({
  toc,
  activeUrl,
  isRevealed,
  depth = 0
}: ExpandedTocItemProps) {
  const isActive = activeUrl === toc.url

  return (
    <li>
      <a
        href={toc.url}
        aria-current={isActive ? 'location' : undefined}
        aria-label={toc.title}
        tabIndex={isRevealed ? undefined : -1}
        className={cn(
          styles.entry,
          'rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:focus-visible:ring-neutral-400',
          isActive
            ? 'text-neutral-800 dark:text-neutral-200'
            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
        )}
      >
        <span aria-hidden="true">{toc.title}</span>
      </a>
      {toc.items.length > 0 ? (
        <ol className={cn(styles.nested, depth === 0 && styles.group)}>
          {toc.items.map(childToc => (
            <ExpandedTocItem
              toc={childToc}
              key={childToc.url}
              activeUrl={activeUrl}
              isRevealed={isRevealed}
              depth={depth + 1}
            />
          ))}
        </ol>
      ) : null}
    </li>
  )
}

interface SkeletonTocItemProps {
  toc: TocEntry
  activeUrl?: string
  isRevealed: boolean
  longestTitle: number
  onFocus: (url: string) => void
}

function SkeletonTocItem({
  toc,
  activeUrl,
  isRevealed,
  longestTitle,
  onFocus
}: SkeletonTocItemProps) {
  const isActive = activeUrl === toc.url

  return (
    <li>
      <a
        href={toc.url}
        aria-current={isActive ? 'location' : undefined}
        aria-label={toc.title}
        tabIndex={isRevealed ? -1 : undefined}
        style={
          {
            '--toc-bar-width': `${Math.max(12, (toc.title.length / longestTitle) * 64)}px`
          } as CSSProperties
        }
        className={cn(
          styles.skeletonEntry,
          'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400',
          isActive
            ? 'text-neutral-800 dark:text-neutral-200'
            : 'text-neutral-500 dark:text-neutral-500'
        )}
        onFocus={() => onFocus(toc.url)}
      />
      {toc.items.length > 0 ? (
        <ol className={styles.nested}>
          {toc.items.map(childToc => (
            <SkeletonTocItem
              toc={childToc}
              key={childToc.url}
              activeUrl={activeUrl}
              isRevealed={isRevealed}
              longestTitle={longestTitle}
              onFocus={onFocus}
            />
          ))}
        </ol>
      ) : null}
    </li>
  )
}

interface TocProps {
  toc: TocEntry[]
}

const TOC_VERTICAL_PADDING = 24
const TOC_SKELETON_ENTRY_HEIGHT = 10

export function Toc({ toc }: TocProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isDesktopTocVisible, setIsDesktopTocVisible] = useState(false)
  const shellRef = useRef<HTMLElement>(null)
  const expandedRef = useRef<HTMLOListElement>(null)
  const pendingFocusUrlRef = useRef<string>()
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const isRevealedRef = useRef(false)
  const entries = useMemo(() => flattenToc(toc), [toc])
  const longestTitle = Math.max(1, ...entries.map(entry => entry.title.length))
  const collapsedHeight =
    entries.length * TOC_SKELETON_ENTRY_HEIGHT + TOC_VERTICAL_PADDING
  const [expandedGeometry, setExpandedGeometry] = useState({
    maxHeight: 0,
    offset: 0
  })
  const activeUrl = useActiveHeading(entries, isDesktopTocVisible)

  const updateExpandedGeometry = useCallback(() => {
    const shell = shellRef.current
    const outline = expandedRef.current
    const index = document.querySelector<HTMLElement>('[data-toc-index]')
    if (!shell || !outline || !index) return

    const viewportPadding = 16
    const indexGap = 8
    const shellBounds = shell.getBoundingClientRect()
    const indexBounds = index.getBoundingClientRect()
    const mainBounds = shell.closest('main')?.getBoundingClientRect()
    const safeTop = Math.max(viewportPadding, indexBounds.bottom + indexGap)
    const viewportBottom = window.innerHeight - viewportPadding
    const safeBottom = Math.min(
      viewportBottom,
      mainBounds?.bottom ?? viewportBottom
    )
    const maxHeight = Math.max(0, safeBottom - safeTop)
    const outlineHeight = Math.min(outline.scrollHeight, maxHeight)
    const centeredTop =
      shellBounds.top + shellBounds.height / 2 - outlineHeight / 2
    const top = Math.max(
      safeTop,
      Math.min(centeredTop, safeBottom - outlineHeight)
    )
    const nextGeometry = {
      maxHeight,
      offset: top - shellBounds.top
    }

    setExpandedGeometry(currentGeometry =>
      currentGeometry.maxHeight === nextGeometry.maxHeight &&
      currentGeometry.offset === nextGeometry.offset
        ? currentGeometry
        : nextGeometry
    )
  }, [])

  const keepEntryVisible = useCallback(() => {
    const outline = expandedRef.current
    if (!outline?.clientHeight) return

    const entry =
      outline.querySelector('a:focus') ??
      outline.querySelector('[aria-current]')
    if (!entry) return

    const bounds = outline.getBoundingClientRect()
    const target = entry.getBoundingClientRect()
    // Scroll only the rail; scrollIntoView would also move the article.
    if (target.top < bounds.top + 4) {
      outline.scrollTop += target.top - bounds.top - 4
    } else if (target.bottom > bounds.bottom - 4) {
      outline.scrollTop += target.bottom - bounds.bottom + 4
    }
  }, [])

  const reveal = useCallback(
    (nextRevealed: boolean) => {
      if (nextRevealed === isRevealedRef.current) return

      isRevealedRef.current = nextRevealed
      if (nextRevealed) updateExpandedGeometry()
      setIsRevealed(nextRevealed)
    },
    [updateExpandedGeometry]
  )

  const revealFromSkeletonFocus = useCallback(
    (url: string) => {
      pendingFocusUrlRef.current = url
      reveal(true)
    },
    [reveal]
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1320px)')
    const updateVisibility = () => setIsDesktopTocVisible(mediaQuery.matches)

    updateVisibility()
    mediaQuery.addEventListener('change', updateVisibility)
    return () => mediaQuery.removeEventListener('change', updateVisibility)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none)')
    const showPersistentToc = () => {
      if (mediaQuery.matches) reveal(true)
    }

    showPersistentToc()
    mediaQuery.addEventListener('change', showPersistentToc)
    return () => mediaQuery.removeEventListener('change', showPersistentToc)
  }, [reveal])

  useEffect(() => {
    let frameId: number | undefined
    const scheduleGeometryUpdate = () => {
      if (frameId !== undefined) return

      frameId = requestAnimationFrame(() => {
        frameId = undefined
        updateExpandedGeometry()
      })
    }

    updateExpandedGeometry()
    window.addEventListener('resize', scheduleGeometryUpdate)
    window.addEventListener('scroll', scheduleGeometryUpdate, {
      passive: true
    })
    return () => {
      if (frameId !== undefined) cancelAnimationFrame(frameId)
      window.removeEventListener('resize', scheduleGeometryUpdate)
      window.removeEventListener('scroll', scheduleGeometryUpdate)
    }
  }, [toc, updateExpandedGeometry])

  useEffect(() => {
    const pendingUrl = pendingFocusUrlRef.current
    if (!isRevealed || !pendingUrl) return

    pendingFocusUrlRef.current = undefined
    const target = Array.from(
      expandedRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []
    ).find(entry => entry.getAttribute('href') === pendingUrl)
    target?.focus({ preventScroll: true })
  }, [isRevealed])

  useEffect(() => {
    if (!isRevealed) return

    const frame = requestAnimationFrame(keepEntryVisible)
    return () => cancelAnimationFrame(frame)
  }, [activeUrl, isRevealed, keepEntryVisible])

  useEffect(
    () => () => {
      clearTimeout(leaveTimerRef.current)
    },
    []
  )

  if (toc.length === 0) return null

  return (
    <nav
      ref={shellRef}
      aria-label="Table of contents"
      className={cn(
        styles.shell,
        'toc text-[0.85rem] leading-snug text-neutral-600 dark:text-neutral-400'
      )}
      style={
        {
          '--toc-collapsed-height': `${collapsedHeight}px`,
          '--toc-expanded-max-height': `${expandedGeometry.maxHeight}px`,
          '--toc-expanded-offset': `${expandedGeometry.offset}px`
        } as CSSProperties
      }
      data-expanded={isRevealed}
      onPointerEnter={event => {
        if (event.pointerType === 'touch') return
        clearTimeout(leaveTimerRef.current)
        reveal(true)
      }}
      onPointerLeave={() => {
        clearTimeout(leaveTimerRef.current)
        leaveTimerRef.current = setTimeout(() => {
          if (!expandedRef.current?.contains(document.activeElement)) {
            reveal(false)
          }
        }, 250)
      }}
      onPointerCancel={() => {
        clearTimeout(leaveTimerRef.current)
        reveal(false)
      }}
      onBlurCapture={event => {
        if (event.currentTarget.contains(event.relatedTarget)) return
        reveal(false)
      }}
    >
      <ol className={cn(styles.skeleton, 'px-2 py-3')} aria-hidden={isRevealed}>
        {toc.map(tocItem => (
          <SkeletonTocItem
            toc={tocItem}
            key={tocItem.url}
            activeUrl={activeUrl}
            isRevealed={isRevealed}
            longestTitle={longestTitle}
            onFocus={revealFromSkeletonFocus}
          />
        ))}
      </ol>
      <ol
        ref={expandedRef}
        className={cn(styles.expanded, 'overscroll-contain px-2 py-3')}
        aria-hidden={!isRevealed}
      >
        {toc.map(tocItem => (
          <ExpandedTocItem
            toc={tocItem}
            key={tocItem.url}
            activeUrl={activeUrl}
            isRevealed={isRevealed}
          />
        ))}
      </ol>
    </nav>
  )
}
