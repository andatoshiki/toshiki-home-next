'use client'

import React from 'react'
import Link from 'next/link'

import { ToggleTheme } from './toggle-theme'
import { MobileMenu } from './mobile-menu'
import { Signature } from '../../../components/signature'

export function Header() {
  return (
    <header className="mt-10 w-full">
      <div className="content-container m-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-handwrite text-2xl font-bold drop-shadow-lg"
        >
          <Signature className="h-20 w-20 transition-transform duration-150 hover:-rotate-[15deg]" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-16 items-center justify-center rounded-full border border-neutral-200/50 bg-neutral-100/50 px-2 py-1 dark:border-neutral-800/50 dark:bg-neutral-900/50">
            <MobileMenu />
          </div>
          <div className="flex h-8 w-16 items-center justify-center rounded-full border border-neutral-200/50 bg-neutral-100/50 px-2 py-1 dark:border-neutral-800/50 dark:bg-neutral-900/50">
            <ToggleTheme />
          </div>
        </div>
      </div>
    </header>
  )
}
