'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const ArtalkComment = dynamic(
  () =>
    import('~/components/ui/artalk/artalk-comment').then(
      module => module.ArtalkComment
    ),
  { ssr: false }
)

interface LazyArtalkCommentProps {
  pageTitle: string
  pagePath: string
}

export function LazyArtalkComment({
  pageTitle,
  pagePath
}: LazyArtalkCommentProps) {
  const boundaryRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const boundary = boundaryRef.current
    if (!boundary) return

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '600px 0px' }
    )

    observer.observe(boundary)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={boundaryRef} className="min-h-px">
      {shouldLoad ? (
        <ArtalkComment pageTitle={pageTitle} pagePath={pagePath} />
      ) : null}
    </div>
  )
}
