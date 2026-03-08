import React from 'react'
import { cn } from '~/lib/utils/style'

export interface HeroTitleProps {
  className?: string
  children: React.ReactNode
}

export function HeroTitle({ className, children, ...props }: HeroTitleProps) {
  return (
    <h2
      className={cn(
        'text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-500',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}
