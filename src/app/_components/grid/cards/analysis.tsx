import {
  Notebook,
  Scroll,
  TerminalWindow,
  ArrowUpRight
} from '@phosphor-icons/react/dist/ssr'

import NextLink, { LinkProps } from 'next/link'
import { type ReactNode } from 'react'
import { Meow } from './meow'
// import { summary } from '@/lib/utils/content'
import { cn } from '../../../../lib/utils/style'

type StatProps = {
  icon: ReactNode
  label: string
  value: number
  href: string
  className: string
}

const Link = ({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & LinkProps) => (
  <NextLink
    {...props}
    className={cn(
      'inline-flex items-center rounded-md px-1 font-medium text-black transition hover:bg-neutral-200/50 dark:text-white dark:hover:bg-neutral-800/50',
      className
    )}
  >
    {children}
    <ArrowUpRight size="1em" className="ml-1 text-xs" />
  </NextLink>
)

function Stat({ icon, label, value, className, href }: StatProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {icon}
      <Link href={href} className="link">
        <span className="mx-1 text-sm">{label}:</span>
        {value}
      </Link>
    </div>
  )
}
export function AnalysisCard() {
  const stats = [
    {
      icon: <Scroll size="1em" weight="duotone" />,
      label: 'Posts',
      value: 1,
      href: '/blog/posts',
      className: 'pl-0'
    },
    {
      icon: <Notebook size="1em" weight="duotone" />,
      label: 'Snippets',
      value: 3,
      href: '/blog/snippets',
      className: 'pl-4'
    },
    {
      icon: <TerminalWindow size="1em" weight="duotone" />,
      label: 'Leetcode',
      value: 2,
      href: '/blog/leetcode',
      className: 'pl-8'
    }
  ]

  return (
    <div className="analysis-diagonal-bg relative block h-full min-h-40 w-full rounded-xl border border-black/10 bg-card bg-white/70 p-4 shadow-sm md:min-h-0">
      <div className="absolute bottom-0 left-4 z-10 h-fit w-20">
        <Meow />
      </div>
      {/* Stats above diagonal, right-aligned stair-step */}
      <div className="absolute bottom-0 right-0 z-20 flex h-full w-2/3 flex-col items-end justify-center gap-1 pr-8 font-bold">
        <Stat {...stats[0]} className="" />
        <Stat {...stats[1]} className="" />
        <Stat {...stats[2]} className="" />
      </div>
    </div>
  )
}
