'use client'
import Image from 'next/image'
import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'

export function GithubStatsCard() {
  const theme = useAbsoluteTheme()
  const isDark = theme === 'dark'
  const src = isDark
    ? 'https://stats.tosh1ki.de/api?show_bg=1&username=andatoshiki&theme=dark&hide_border=true&show_icons=true'
    : 'https://stats.tosh1ki.de/api?show_bg=1&username=andatoshiki&hide_border=true&show_icons=true'

  return (
    <div className="svgPath rounded-2xl border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-950">
      <Image
        src={src}
        alt="GitHub Stats"
        width={480}
        height={180}
        className="rounded-lg"
        unoptimized
        priority
      />
    </div>
  )
}
