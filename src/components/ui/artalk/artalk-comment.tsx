'use client'

import { useEffect, useRef } from 'react'

// @ts-ignore
import Artalk from 'artalk'
// @ts-ignore
import { ArtalkKatexPlugin } from '@artalk/plugin-katex'
// @ts-ignore
import { ArtalkLightboxPlugin } from '@artalk/plugin-lightbox'
import 'lightgallery/css/lightgallery.css'
import 'katex/dist/katex.min.css'
import 'artalk/Artalk.css'

export function ArtalkComment({
  pageTitle,
  pagePath,
  server = 'https://artalk.toshiki.dev',
  site = 'toshiki-home-next'
}: {
  pageTitle?: string
  pagePath?: string
  server?: string
  site?: string
}) {
  const elRef = useRef<HTMLDivElement>(null)
  // Keep Artalk instance for reload/destroy
  const artalkRef = useRef<any>(null)

  useEffect(() => {
    // Dynamically import lightgallery for the plugin
    async function loadLightGallery() {
      return (await import('lightgallery')).default
    }

    // Register plugins
    Artalk.use(ArtalkKatexPlugin)
    Artalk.use(ArtalkLightboxPlugin, {
      lightGallery: { lib: loadLightGallery }
    })

    Artalk.use((ctx: any) => {
      ctx.on('mounted', () => {
        const locale = document.documentElement.lang.includes('zh')
          ? 'zh-CN'
          : 'en'
        if (locale !== ctx.getConf().locale) ctx.updateConf({ locale })
      })
    })

    // Init Artalk
    artalkRef.current = Artalk.init({
      el: elRef.current,
      emoticons:
        'https://cdn.jsdelivr.net/npm/sticker-heo@2022.7.5/artalk.json',
      avatarURLBuilder: (c: any) =>
        c.is_admin
          ? 'https://youke1.picui.cn/s1/2025/09/21/68cf783518781.jpg'
          : `https://avatar.tosh1ki.de/avatar/${c.email_encrypted}`,
      pageKey:
        pagePath ||
        (typeof window !== 'undefined'
          ? window.location.pathname
              .replace(/^\/+/, '')
              .replace(/^zh\//, '')
              .replace(/\.html$/, '') + '.html'
          : ''),
      pageTitle:
        pageTitle || (typeof document !== 'undefined' ? document.title : ''),
      server,
      site
    })

    // Dark mode sync
    function syncDarkMode() {
      const dark = document.documentElement.classList.contains('dark')
      artalkRef.current?.setDarkMode(dark)
    }
    syncDarkMode()
    const observer = new MutationObserver(() => syncDarkMode())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
      artalkRef.current?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageTitle, pagePath, server, site])

  return <div ref={elRef} style={{ marginTop: 20 }} />
}
