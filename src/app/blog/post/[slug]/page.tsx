import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Folder,
  CalendarBlank,
  Eye,
  Tag,
  ArrowsHorizontal
} from '@phosphor-icons/react/dist/ssr'

import { posts } from '#content'
import type { Post } from '#content'

import { slug } from '~/lib/slug'
import { Date } from '~/components/date'
import { BlogMdxContent } from '../../_components/blog-mdx-content'

import { postMdxComponents } from './_components/mdx-components'
import { LazyArtalkComment } from './_components/lazy-artalk-comment'
import { PostNavigation } from './_components/post-navigation'
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

export default function Page({ params }: Props) {
  const post = posts.find(post => post.slug === params.slug)

  if (!post) return notFound()

  const footerDate = post.lastUpdate ?? post.date
  const footerDateLabel = post.lastUpdate ? 'updated on' : 'published on'

  return (
    <div className="content-container m-auto">
      <div className="relative">
        <PostNavigation toc={post.toc} />
        <div className="flex flex-col gap-4 leading-6">
          <div className="blog-meta-row">
            <span className="inline-flex items-center gap-2">
              <span className="blog-meta-item">
                <CalendarBlank
                  aria-hidden="true"
                  size={18}
                  className="shrink-0"
                />
                <Date dateString={post.date} />
              </span>
              {post.lastUpdate && (
                <span
                  className="inline-flex items-center gap-1"
                  title="Last Update"
                >
                  <ArrowsHorizontal
                    aria-hidden="true"
                    size={16}
                    className="shrink-0"
                  />
                  <span>updated</span>
                  <Date dateString={post.lastUpdate} />
                </span>
              )}
            </span>
            <span className="blog-meta-item">
              <Folder aria-hidden="true" size={18} className="shrink-0" />
              <Link
                href={`/blog/categories/${slug(post.category)}`}
                className="text-neutral-500 no-underline transition-colors duration-200 ease-out hover:text-neutral-700 active:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 dark:active:text-neutral-100"
              >
                {post.category}
              </Link>
            </span>
            {post.tags.length > 0 && (
              <span className="blog-meta-item">
                <Tag aria-hidden="true" size={18} className="shrink-0" />
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
              <Eye aria-hidden="true" size={18} className="shrink-0" />
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
        <div
          className="blog-section-divider blog-section-divider-near-hero"
          aria-hidden="true"
        />
        <div className="post-content">
          <BlogMdxContent code={post.content} components={postMdxComponents} />
        </div>
        <div className="blog-footer-note blog-footer-note-near-outro">
          <div className="blog-footer-note-meta">
            <span>
              {footerDateLabel} <Date dateString={footerDate} />
            </span>
          </div>
          <a
            href="https://github.com/andatoshiki/toshiki-home-next/blob/master/LICENSE"
            className="blog-footer-note-link"
            rel="license noopener noreferrer"
            target="_blank"
          >
            license
          </a>
        </div>
        <div
          className="blog-section-divider blog-section-divider-near-footer"
          aria-hidden="true"
        />
      </div>
      <div className="pt-12">
        <LazyArtalkComment pageTitle={post.title} pagePath={post.slug} />
      </div>
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
