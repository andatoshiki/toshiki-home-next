'use client'

import { CaretUp } from '@phosphor-icons/react/dist/ssr'
import { useEffect, useState } from 'react'

export function TopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let animationFrame = 0

    const updateVisibility = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 0)
      })
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', updateVisibility)
    }
  }, [])

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Go to top"
      aria-label="Go to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-7 right-7 hidden touch-manipulation items-center justify-center rounded-full p-2 transition-[background-color,opacity] hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-400 md:flex ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <CaretUp aria-hidden="true" className="text-2xl" />
    </button>
  )
}
