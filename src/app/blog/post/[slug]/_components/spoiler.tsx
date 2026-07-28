'use client'

import { EyeSlash } from '@phosphor-icons/react/dist/ssr'
import { ComponentProps, useState } from 'react'
import clsx from 'clsx'

const inertElementProps = { inert: '' } as unknown as ComponentProps<'div'>

export function Spoiler({
  children,
  className,
  ...rest
}: ComponentProps<'div'>) {
  const [hide, setHide] = useState(true)

  return (
    <div {...rest} className={clsx('relative w-full', className)}>
      <div
        data-hide={hide}
        className="w-full data-[hide='true']:blur-lg"
        aria-hidden={hide}
        {...(hide ? inertElementProps : {})}
      >
        {children}
      </div>
      <div
        data-hide={hide}
        className="absolute inset-0 flex items-center justify-center data-[hide='false']:hidden"
      >
        <div className="divide-y divide-neutral-200 text-center dark:divide-neutral-500">
          <div className="flex justify-center py-2 text-3xl">
            <EyeSlash aria-hidden="true" size="1em" />
          </div>
          <button
            type="button"
            className="rounded-sm py-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400"
            onClick={() => setHide(false)}
          >
            Show content
          </button>
        </div>
      </div>
    </div>
  )
}
