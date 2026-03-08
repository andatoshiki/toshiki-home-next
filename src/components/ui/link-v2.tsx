import NextLink, { LinkProps } from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'

export interface LinkV2Props extends LinkProps {
  label: string
  className?: string
}

export function LinkV2({ label, className, ...props }: LinkV2Props) {
  return (
    <NextLink
      {...props}
      className={`inline-flex items-center rounded-md px-1 font-medium text-black transition hover:bg-neutral-200/50 dark:text-white dark:hover:bg-neutral-800/50 ${className || ''}`}
    >
      <span>{label}</span>
      <ArrowUpRight size="1em" className="text-xs" />
    </NextLink>
  )
}
