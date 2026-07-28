import type { ComponentProps } from 'react'
import type { MDXComponents } from 'mdx/types'
import {
  Check,
  Lightbulb,
  Warning,
  WarningOctagon,
  X
} from '@phosphor-icons/react/dist/ssr'
import { BiSolidQuoteAltRight } from 'react-icons/bi'
import clsx from 'clsx'
import { Anchor } from './anchor'
import { PrettyCodeElement } from './pretty-code-element'
import { Ruby } from './ruby'
import { Spoiler } from './spoiler'

type MessageBoxProps = ComponentProps<'div'> & { message?: string }

export const postMdxComponents = {
  a: ({ children, href, ...props }: ComponentProps<'a'>) =>
    href?.startsWith('http') ? (
      <Anchor href={href} {...props}>
        {children}
      </Anchor>
    ) : (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  figure: PrettyCodeElement,
  Correct: ({ children, message, className, ...rest }: MessageBoxProps) => (
    <div {...rest} className={clsx('answer correct', className)}>
      <span className="icon" aria-hidden="true">
        <Check size="1em" />
      </span>
      <div className="content">{children}</div>
      {message ? <span className="message">{message}</span> : null}
    </div>
  ),
  Wrong: ({ children, message, className, ...rest }: MessageBoxProps) => (
    <div {...rest} className={clsx('answer wrong', className)}>
      <span className="icon" aria-hidden="true">
        <X size="1em" />
      </span>
      <div className="content">{children}</div>
      {message ? <span className="message">{message}</span> : null}
    </div>
  ),
  Tip: ({ children, className, ...rest }: ComponentProps<'div'>) => (
    <div {...rest} className={clsx('hint tip', className)}>
      <span className="icon" aria-hidden="true">
        <Lightbulb size="1em" />
      </span>
      {children}
    </div>
  ),
  Warn: ({ children, className, ...rest }: ComponentProps<'div'>) => (
    <div {...rest} className={clsx('hint warn', className)}>
      <span className="icon" aria-hidden="true">
        <Warning size="1em" />
      </span>
      {children}
    </div>
  ),
  Error: ({ children, className, ...rest }: ComponentProps<'div'>) => (
    <div {...rest} className={clsx('hint error', className)}>
      <span className="icon" aria-hidden="true">
        <WarningOctagon size="1em" />
      </span>
      {children}
    </div>
  ),
  blockquote: ({ children, ...rest }: ComponentProps<'blockquote'>) => (
    <blockquote {...rest}>
      <span className="icon" aria-hidden="true">
        <BiSolidQuoteAltRight size="1em" />
      </span>
      {children}
    </blockquote>
  ),
  Spoiler,
  Ruby
} satisfies MDXComponents
