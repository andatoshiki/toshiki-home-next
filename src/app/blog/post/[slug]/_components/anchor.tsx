import { AnchorHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

import { Link as LinkIcon } from '@phosphor-icons/react/dist/ssr'
import clsx from 'clsx'

interface Props
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  children: ReactNode
}

export function Anchor({ children, href, className, ...props }: Props) {
  return (
    <a
      {...props}
      className={clsx('leading-none [overflow-wrap:anywhere]', className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{children}</span>{' '}
      <LinkIcon
        aria-hidden="true"
        size="1em"
        className="inline align-[-0.1em] text-xs"
      />
    </a>
  )
}
