/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { cn } from '~/lib/utils/style'

export interface BlockCardProps {
  className?: string
  children?: React.ReactNode
  href?: string
  external?: boolean
}

export interface BlockCardHeaderProps {
  className?: string
  children?: React.ReactNode
}

export interface BlockCardContentProps {
  className?: string
  children?: React.ReactNode
}

export interface BlockCardTitleProps {
  className?: string
  children?: React.ReactNode
}

export interface BlockCardDescriptionProps {
  className?: string
  children?: React.ReactNode
}

export interface BlockCardIconProps {
  className?: string
  children?: React.ReactNode
  imgSrc?: string
  imgAlt?: string
}

export function BlockCard({
  className,
  children,
  href,
  external = false,
  ...props
}: BlockCardProps) {
  const baseClasses = cn(
    'flex h-28 max-w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950',
    href &&
      'cursor-pointer transition-colors duration-200 hover:bg-neutral-50 hover:border-neutral-300 dark:hover:bg-neutral-900 dark:hover:border-neutral-700',
    className
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
          {children}
        </a>
      )
    }

    return (
      <Link href={href} className={baseClasses} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}

export function BlockCardHeader({
  className,
  children,
  ...props
}: BlockCardHeaderProps) {
  return (
    <div className={cn('flex min-w-0 flex-col', className)} {...props}>
      {children}
    </div>
  )
}

export function BlockCardContent({
  className,
  children,
  ...props
}: BlockCardContentProps) {
  return (
    <div className={cn('flex min-w-0 flex-col', className)} {...props}>
      {children}
    </div>
  )
}

export function BlockCardTitle({
  className,
  children,
  ...props
}: BlockCardTitleProps) {
  return (
    <h3
      className={cn(
        'truncate text-lg font-semibold text-neutral-900 dark:text-neutral-100',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function BlockCardDescription({
  className,
  children,
  ...props
}: BlockCardDescriptionProps) {
  return (
    <p
      className={cn(
        'line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function BlockCardIcon({
  className,
  children,
  imgSrc,
  imgAlt,
  ...props
}: BlockCardIconProps) {
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={imgAlt || ''}
        className={cn(
          'h-12 w-12 flex-shrink-0 rounded-full bg-neutral-100 object-cover dark:bg-neutral-900',
          className
        )}
        {...props}
      />
    )
  }
  return (
    <div
      className={cn(
        'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-2xl font-semibold text-neutral-500 dark:bg-neutral-900',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Compound component pattern
BlockCard.Header = BlockCardHeader
BlockCard.Content = BlockCardContent
BlockCard.Title = BlockCardTitle
BlockCard.Description = BlockCardDescription
BlockCard.Icon = BlockCardIcon
