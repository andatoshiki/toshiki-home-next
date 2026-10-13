'use client'

import { LastfmLogo } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { useLastFmNowPlaying } from '~/hooks/use-lastfm-data'
import { cn } from '~/lib/utils/style'
import { getNowPlayingCard } from './now-playing-state'

// Shown when the track has no cover art or no track is known
const VINYL_PLACEHOLDER = '/assets/vinyl-placeholder.svg'

const CARD_CLASS =
  'relative flex h-36 items-center justify-center overflow-hidden rounded-lg bg-black text-white'

export function NowPlayingMusic() {
  const { data, isLoading } = useLastFmNowPlaying()
  const card = getNowPlayingCard(data, isLoading)

  if (card.kind === 'placeholder') {
    return (
      <div aria-busy={card.pending} className={CARD_CLASS}>
        <CardContent
          title={card.title}
          artist={card.artist}
          caption={card.caption}
          pulse={card.pending}
        />
        <SpinningDisc src={VINYL_PLACEHOLDER} alt="" />
      </div>
    )
  }

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(CARD_CLASS, 'transform-gpu duration-500 hover:scale-95')}
    >
      <CardContent
        title={card.title}
        artist={card.artist}
        caption={card.caption}
      />
      <SpinningDisc
        src={card.image ?? VINYL_PLACEHOLDER}
        alt={card.image ? `${card.title} cover art` : ''}
      />
    </a>
  )
}

function CardContent({
  title,
  artist,
  caption,
  pulse = false
}: {
  title: string
  artist: string
  caption: string
  pulse?: boolean
}) {
  return (
    <>
      <LastfmLogo
        size="1em"
        className="absolute left-0 top-0 text-[50px] text-red-800"
      />
      <div className="absolute inset-y-1 right-2 z-10 flex w-10 justify-center overflow-hidden">
        <div
          className={cn(
            'side-text relative h-full max-w-full font-extrabold leading-none text-white',
            pulse && 'animate-pulse motion-reduce:animate-none'
          )}
        >
          <span className="absolute h-fit max-h-full truncate text-xl opacity-30">
            {artist}
          </span>
          <div className="truncate">{title}</div>
          <div className="truncate text-xs font-normal">{caption}</div>
        </div>
      </div>
    </>
  )
}

function SpinningDisc({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      {/* Blurred glow behind the disc; decorative */}
      <Image
        src={src}
        alt=""
        className="absolute -bottom-10 -left-14 z-0 scale-110 rounded-full opacity-90 blur-3xl"
        width={200}
        height={200}
      />
      <Image
        src={src}
        alt={alt}
        className="absolute -bottom-10 -left-14 z-[1] animate-spin overflow-hidden rounded-full drop-shadow-[0_0_30px_rgba(255,255,255,0.55)] animate-duration-[65s]"
        placeholder="empty"
        width={200}
        height={200}
      />
    </>
  )
}
