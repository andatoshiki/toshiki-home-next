'use client'
import { useEffect, useState } from 'react'
import { MastodonLogo } from '@phosphor-icons/react'
import { XMLParser } from 'fast-xml-parser'

const msatodon_api_url = process.env.MASTODON_API_ENDPOINT || 'mastodon.social'
const username = process.env.MASTODON_USERNAME || 'andatoshiki'
const mastodon_rss = `https://${msatodon_api_url}/@${username}.rss`

function parseMastodonRss(xml: string) {
  const parser = new XMLParser({ ignoreAttributes: false })
  const json = parser.parse(xml)
  const items = json.rss?.channel?.item || []
  return Array.isArray(items) ? items : [items]
}

export default function MastodonRssCard() {
  const [posts, setPosts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRss() {
      try {
        const res = await fetch(mastodon_rss)
        const xml = await res.text()
        const items = parseMastodonRss(xml)
        setPosts(items.slice(0, 4))
      } catch (e) {
        setError('Failed to fetch Mastodon RSS')
      } finally {
        setLoading(false)
      }
    }
    fetchRss()
  }, [])

  return (
    <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-5 text-sm shadow-md dark:border-neutral-800">
      <header className="flex items-center gap-2">
        <MastodonLogo size={20} />
        <span>Mastodon</span>
      </header>
      {error && <div className="text-xs text-red-500">{error}</div>}
      <ul className="space-y-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <li key={i}>
                <div className="mb-1 animate-pulse rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-black">
                  <div className="mb-2 h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="mb-1 h-3 w-1/4 rounded bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
                </div>
              </li>
            ))
          : posts.map((post: any) => (
              <li key={post.link}>
                <div className="mb-1 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-black">
                  <a
                    href={post.link}
                    target="_blank"
                    className="font-medium hover:underline"
                  >
                    {post.title}
                  </a>
                  <div className="text-xs opacity-70">
                    {new Date(post.pubDate).toLocaleDateString()}
                  </div>
                  <div className="line-clamp-2 text-xs opacity-80">
                    {typeof post.description === 'string'
                      ? post.description.replace(/<[^>]+>/g, '')
                      : ''}
                  </div>
                </div>
              </li>
            ))}
      </ul>
    </div>
  )
}
