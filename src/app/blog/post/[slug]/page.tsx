import React, { ComponentProps } from 'react'
import type { Metadata } from 'next'
import { ArtalkComment } from '~/components/ui/artalk/artalk-comment'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Toc } from '../../_components/toc'
import {
  Folder,
  CalendarBlank,
  Eye,
  Tag,
  Lightbulb,
  Warning,
  WarningOctagon,
  Check,
  X,
  ArrowsHorizontal
} from '@phosphor-icons/react/dist/ssr'
import { BiSolidQuoteAltRight } from 'react-icons/bi'

import { Post, posts } from '#content'

import { slug } from '~/lib/slug'
import { Date } from '~/components/date'
// import { GiscusComments } from '~/components/giscus-comments'
import { MDXContent } from '~/components/mdx-content'

import { TopButton } from './_components/top-button'
import { Anchor } from './_components/anchor'
import { PrettyCodeElement } from './_components/pretty-code-element'
// import { VitePressStyledCopyCode } from './_components/vitepress-styled-copy-code'
import { CopyButton } from './_components/copy-button'
import { Spoiler } from './_components/spoiler'
import { Ruby } from './_components/ruby'
import 'katex/dist/katex.min.css'

interface Props {
  params: { slug: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const post = posts.find(post => post.slug === params.slug) as Post

  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    authors: { name: 'Mateus Felipe Gonçalves', url: 'https://mateusf.com' },
    keywords: post.tags,
    publisher: 'Mateus Felipe Gonçalves <contact@mateusf.com>',
    openGraph: {
      title: post.title,
      description: post.description,
      tags: post.tags,
      authors: 'Mateus Felipe Gonçalves <contact@mateusf.com>',
      type: 'article',
      url: `/blog/post/${params.slug}`,
      images: {
        // url: `/blog/post/${post.slug}/thumbnail`,
        url: `/assets/og/blog/${post.slug}.jpg`,
        width: 1200,
        height: 630
      }
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: 'Mateus Felipe Gonçalves <contact@mateusf.com>',
      site: '/',
      images: {
        // url: `/blog/post/${post.slug}/thumbnail`,
        url: `/assets/og/blog/${post.slug}.jpg`,
        width: 1200,
        height: 630
      }
    }
  }
}

const mdxComponents = {
  a: ({ children, href, ...props }) =>
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
  Correct: ({
    children,
    message,
    ...rest
  }: ComponentProps<'div'> & { message?: string }) => (
    <div {...rest} className="answear correct">
      <span className="icon">
        <Check size="1em" />
      </span>
      <div className="content">{children}</div>
      {message && <span className="message">{message}</span>}
    </div>
  ),
  Wrong: ({
    children,
    message,
    ...rest
  }: ComponentProps<'div'> & { message?: string }) => (
    <div {...rest} className="answear wrong">
      <span className="icon">
        <X size="1em" />
      </span>
      <div className="content">{children}</div>
      {message && <span className="message">{message}</span>}
    </div>
  ),
  Tip: ({ children, ...rest }: ComponentProps<'div'>) => (
    <div {...rest} className="hint tip">
      <span className="icon">
        <Lightbulb size="1em" />
      </span>
      {children}
    </div>
  ),
  Warn: ({ children, ...rest }: ComponentProps<'div'>) => (
    <div {...rest} className="hint warn">
      <span className="icon">
        <Warning size="1em" />
      </span>
      {children}
    </div>
  ),
  Error: ({ children, ...rest }: ComponentProps<'div'>) => (
    <div {...rest} className="hint error">
      <span className="icon">
        <WarningOctagon size="1em" />
      </span>
      {children}
    </div>
  ),
  blockquote: ({ children, ...rest }: ComponentProps<'blockquote'>) => (
    <blockquote {...rest}>
      <span className="icon">
        <BiSolidQuoteAltRight size="1em" />
      </span>
      {children}
    </blockquote>
  ),
  Spoiler,
  Ruby,
  table: ({ children, ...rest }: ComponentProps<'table'>) => (
    <div className="my-3 overflow-x-auto">
      <table {...rest}>{children}</table>
    </div>
  )
}

export default function Page({ params }: Props) {
  const post = posts.find(post => post.slug === params.slug)

  if (!post) return notFound()

  return (
    <div className="content-container m-auto">
      <div className="relative">
        <aside className="absolute right-full top-0 z-10 mr-6 hidden h-full w-52 min-[1320px]:block">
          <div className="sticky top-20">
            <Toc toc={post.toc} mode="sidebar" />
          </div>
        </aside>
        <div className="flex flex-col gap-4 leading-6">
          <div className="blog-meta-row">
            <span className="inline-flex items-center gap-2">
              <span className="blog-meta-item">
                <CalendarBlank size={18} className="shrink-0" />
                <Date dateString={post.date} />
              </span>
              {post.lastUpdate && (
                <span
                  className="inline-flex items-center gap-1"
                  title="Last Update"
                >
                  <ArrowsHorizontal size={16} className="shrink-0" />
                  <span>updated</span>
                  <Date dateString={post.lastUpdate} />
                </span>
              )}
            </span>
            <span className="blog-meta-item">
              <Folder size={18} className="shrink-0" />
              <Link
                href={`/blog/categories/${slug(post.category)}`}
                className="text-neutral-500 no-underline transition-colors duration-200 ease-out hover:text-neutral-700 active:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 dark:active:text-neutral-100"
              >
                {post.category}
              </Link>
            </span>
            {post.tags.length > 0 && (
              <span className="blog-meta-item">
                <Tag size={18} className="shrink-0" />
                <span className="blog-meta-taxonomy">
                  {post.tags.map((tag, index) => (
                    <React.Fragment key={tag}>
                      <Link
                        href={`/blog/tag/${slug(tag)}`}
                        className="text-neutral-500 no-underline transition-colors duration-200 ease-out hover:text-neutral-700 active:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 dark:active:text-neutral-100"
                      >
                        {tag}
                      </Link>
                      {index < post.tags.length - 1 ? (
                        <span
                          className="blog-meta-separator"
                          aria-hidden="true"
                        >
                          -
                        </span>
                      ) : null}
                    </React.Fragment>
                  ))}
                </span>
              </span>
            )}
            <span className="blog-meta-item">
              <Eye size={18} className="shrink-0" />
              <span>{Math.ceil(post.metadata.readingTime)} minutes</span>
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="text-left text-4xl font-bold md:text-left">
                {post.title}
              </h1>
            </div>
            {post.description ? (
              <p className="w-full text-[0.95rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {post.description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="post-content">
          <MDXContent code={post.content} components={mdxComponents} />
        </div>
      </div>
      <div className="pt-12">
        <ArtalkComment
          pageTitle={post.title}
          pagePath={post.slug}
          // server, site are optional and have defaults
        />
      </div>
      <TopButton />
    </div>
  )
}

export async function generateStaticParams() {
  return posts
    .filter(post => post.status !== 'planned')
    .map(post => ({
      slug: post.slug
    }))
}
