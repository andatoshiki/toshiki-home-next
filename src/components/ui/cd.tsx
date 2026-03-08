'use client'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import NextLink from 'next/link'
import { CaretRight } from '@phosphor-icons/react'

export default function CdLinks() {
  const router = useRouter()
  const pathname = usePathname()

  // Hide on homepage
  if (pathname === '/') return null

  // Get previous page from browser history
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    router.back()
  }

  return (
    <div className="mt-12 flex select-none flex-col gap-1 font-mono text-sm">
      <div className="flex items-center gap-2">
        <CaretRight size={18} className="text-gray-400" />
        <NextLink
          href="/"
          className="inline-flex items-center rounded-md px-1 font-medium text-neutral-500 transition hover:bg-neutral-200/90 dark:text-neutral-600 dark:hover:bg-neutral-800/90"
        >
          <span>cd ~</span>
        </NextLink>
      </div>
      <div className="flex items-center gap-2">
        <CaretRight size={18} className="text-gray-400" />
        <a
          href="#"
          onClick={handleBack}
          className="inline-flex items-center rounded-md px-1 font-medium text-neutral-500 transition hover:bg-neutral-200/90 dark:text-neutral-600 dark:hover:bg-neutral-800/90"
        >
          <span>cd ..</span>
        </a>
      </div>
    </div>
  )
}
