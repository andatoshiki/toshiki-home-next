'use client'
import React, { useEffect, useState } from 'react'
import { cn } from '~/lib/utils/style'

export interface FriendCardProps {
  className?: string
  title: string
  description: string
  imgSrc: string
  imgAlt?: string
  siteUrl: string // URL to measure latency to and link to
}

export function FriendCard({
  className,
  title,
  description,
  imgSrc,
  imgAlt,
  siteUrl,
  ...props
}: FriendCardProps) {
  const cardBase =
    'relative flex h-28 max-w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950'

  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>(
    'checking'
  )

  useEffect(() => {
    let cancelled = false
    const checkStatus = async () => {
      try {
        // Use HEAD if possible, fallback to GET
        await fetch(siteUrl, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store'
        })
        if (!cancelled) setStatus('online')
      } catch {
        // fallback: try GET (may still fail for CORS)
        try {
          await fetch(siteUrl, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-store'
          })
          if (!cancelled) setStatus('online')
        } catch {
          if (!cancelled) setStatus('offline')
        }
      }
    }
    checkStatus()
    return () => {
      cancelled = true
    }
  }, [siteUrl])

  // Determine badge color based on status
  let badgeClass =
    'border-neutral-200/20 bg-neutral-200/40 text-neutral-600 dark:border-neutral-800/40 dark:bg-neutral-800/40 dark:text-neutral-300'
  if (status === 'online') {
    badgeClass =
      'border-green-600/20 bg-green-600/5 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300'
  } else if (status === 'offline') {
    badgeClass =
      'border-red-600/20 bg-red-600/5 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300'
  }

  const cardClasses = cn(
    'flex h-28 max-w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950',
    siteUrl &&
      'cursor-pointer transition-colors duration-200 hover:bg-neutral-50 hover:border-neutral-300 dark:hover:bg-neutral-900 dark:hover:border-neutral-700',
    className
  )

  const cardContent = (
    <>
      <div className="relative">
        <img
          src={imgSrc}
          alt={imgAlt || title}
          className="h-12 w-12 flex-shrink-0 rounded-full bg-neutral-100 object-cover dark:bg-neutral-900"
        />
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-row items-center gap-2">
          <h3 className="truncate text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          <span
            className={cn(
              'w-fit rounded border px-2 py-0.5 text-xs font-medium',
              badgeClass
            )}
          >
            {status === 'checking'
              ? '...'
              : status === 'online'
                ? 'Online'
                : 'Offline'}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
    </>
  )

  // Always wrap in <a> for now, since siteUrl is required
  return (
    <a
      href={siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClasses}
      {...props}
    >
      {cardContent}
    </a>
  )
}
