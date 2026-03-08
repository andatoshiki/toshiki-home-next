import React from 'react'
import Link from 'next/link'
import { cn } from '~/lib/utils/style'

export interface PagesCardProps {
  className?: string
  title: string
  description: string
  icon?: React.ReactNode
  imgSrc?: string
  imgAlt?: string
  href?: string
  external?: boolean
}

export function PagesCard({
  className,
  title,
  description,
  icon,
  imgSrc,
  imgAlt,
  href,
  external = false,
  ...props
}: PagesCardProps) {
  const baseClasses = cn(
    'flex h-28 max-w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950',
    href &&
      'cursor-pointer transition-colors duration-200 hover:bg-neutral-50 hover:border-neutral-300 dark:hover:bg-neutral-900 dark:hover:border-neutral-700',
    className
  )

  const content = (
    <>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={imgAlt || title}
          className="h-12 w-12 flex-shrink-0 rounded-full bg-neutral-100 object-cover dark:bg-neutral-900"
        />
      ) : (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-2xl font-semibold text-neutral-500 dark:bg-neutral-900">
          {icon}
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <h3 className="truncate text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
    </>
  )

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          {...props}
        >
          {content}
        </a>
      )
    }

    return (
      <Link href={href} className={baseClasses} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <div className={baseClasses} {...props}>
      {content}
    </div>
  )
}
