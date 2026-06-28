'use client'

import { LastfmLogo, StarFour } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { useLastFmTopTracks } from '~/hooks/use-lastfm-data'

const DISC_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="360.000000pt" height="360.000000pt" viewBox="0 0 360.000000 360.000000" preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="placeholder-bg" cx="50%" cy="42%" r="58%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="68%" stop-color="#F5F5F5" />
        <stop offset="100%" stop-color="#E5E7EB" />
      </radialGradient>
      <filter id="placeholder-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000000" flood-opacity="0.18" />
      </filter>
    </defs>
    <circle cx="180" cy="180" r="164" fill="url(#placeholder-bg)" />
    <circle cx="180" cy="180" r="164" fill="none" stroke="#E5E7EB" stroke-width="2" />
    <g transform="translate(-7.200000,367.200000) scale(0.104000,-0.104000)" fill="#111111" stroke="none" filter="url(#placeholder-shadow)">
      <path d="M1695 3059 c-119 -8 -190 -21 -293 -56 -239 -79 -470 -247 -620 -448 -108 -146 -202 -366 -233 -545 -16 -96 -16 -324 0 -420 31 -179 125 -398 233 -545 185 -250 473 -431 786 -491 116 -23 345 -23 466 1 334 64 631 261 824 546 81 120 158 310 187 464 20 106 20 366 0 472 -61 323 -239 597 -520 801 -231 167 -509 241 -830 221z m-30 -99 c-196 -34 -339 -91 -495 -194 -281 -188 -468 -479 -531 -830 l-18 -101 6 85 c28 419 277 780 658 956 129 60 306 101 435 102 32 0 16 -5 -55 -18z m95 -84 c0 -2 -37 -9 -82 -16 -162 -23 -368 -109 -500 -209 -241 -183 -383 -425 -446 -761 -10 -53 -11 -52 -6 25 31 471 389 871 844 945 41 6 82 13 90 15 24 4 100 5 100 1z m-80 -116 c-221 -42 -385 -126 -542 -278 -160 -155 -264 -353 -299 -569 -17 -106 -24 -73 -9 44 45 358 279 647 626 772 70 26 197 49 269 49 43 0 37 -2 -45 -18z m1 -101 c-196 -41 -363 -131 -492 -266 -129 -133 -207 -282 -249 -474 l-20 -94 6 84 c6 95 41 226 80 304 78 155 224 302 379 380 95 48 241 84 345 85 36 0 25 -4 -49 -19z m13 -99 c-163 -37 -294 -103 -401 -203 -135 -126 -211 -265 -258 -467 l-15 -65 5 75 c10 133 45 235 121 350 126 192 366 328 579 328 49 0 48 0 -31 -18z m66 -87 c-168 -28 -305 -98 -420 -213 -102 -101 -159 -202 -195 -343 -19 -76 -24 -85 -24 -52 -1 70 27 177 70 264 59 119 162 222 279 280 93 45 187 70 265 69 28 0 39 -3 25 -5z m-48 -112 c-237 -59 -409 -230 -471 -471 -19 -72 -20 -73 -20 -30 -2 221 182 450 405 504 33 8 82 14 109 14 l50 1 -73 -18z m180 -132 c199 -43 348 -225 348 -429 0 -170 -99 -322 -258 -398 -74 -35 -81 -37 -182 -37 -100 0 -108 2 -183 37 -231 110 -321 371 -206 599 87 173 288 269 481 228z m473 -594 c-22 -97 -69 -180 -145 -255 -100 -100 -237 -161 -360 -159 -44 0 -43 1 28 18 185 46 342 170 420 332 22 46 47 113 54 149 13 63 13 64 16 24 2 -23 -4 -72 -13 -109z m101 -6 c-39 -186 -169 -355 -336 -438 -87 -42 -194 -71 -265 -70 -33 0 -23 4 52 24 142 36 242 93 344 195 70 69 94 102 132 177 26 54 53 127 64 174 15 67 19 76 21 47 2 -19 -4 -68 -12 -109z m99 -11 c-9 -44 -25 -103 -36 -131 -70 -178 -238 -346 -415 -416 -66 -26 -191 -51 -246 -50 -38 1 -34 3 38 19 98 22 196 60 279 108 83 48 222 190 273 278 44 77 95 216 109 299 l8 50 3 -39 c2 -21 -4 -74 -13 -118z m110 70 c-17 -197 -92 -362 -229 -507 -146 -152 -332 -241 -537 -255 l-84 -6 94 20 c190 42 330 114 462 238 144 135 239 307 276 501 10 50 20 91 22 91 2 0 0 -37 -4 -82z m95 -53 c-56 -410 -369 -734 -773 -800 -135 -22 -198 -18 -77 5 224 42 381 123 541 277 163 157 264 348 300 569 17 105 25 65 9 -51z m101 0 c-67 -503 -460 -877 -956 -909 -77 -5 -78 -5 -25 5 233 44 392 111 544 227 226 174 384 441 427 722 17 106 25 68 10 -45z m99 -1 c-56 -521 -466 -939 -985 -1003 -135 -16 -164 -11 -50 9 222 39 393 112 560 239 251 190 434 511 470 821 5 36 10 59 12 52 3 -7 0 -60 -7 -118z"/>
    </g>
  </svg>
`.trim()
)}`

export function MostListenedMusic() {
  const { data, isLoading } = useLastFmTopTracks('1month', 1)
  const track = data?.tracks[0]

  if (!track) {
    return (
      <div className="flex h-36 items-center justify-center rounded-lg bg-black text-neutral-500">
        <StarFour
          size={36}
          weight="duotone"
          className={isLoading ? 'animate-pulse' : undefined}
        />
      </div>
    )
  }

  const { name: title, artist, url, image } = track

  return (
    <a
      target="_blank"
      className="relative flex h-36 transform-gpu items-center justify-center overflow-hidden rounded-lg bg-[#000] text-white duration-500 hover:scale-95"
      href={url}
    >
      <LastfmLogo
        size="1em"
        className="absolute left-0 top-0 text-[50px] text-red-800"
      />
      <div className="absolute inset-y-1 right-2 z-10 flex w-10 justify-center overflow-hidden">
        <div className="side-text relative h-full max-w-full font-extrabold leading-none text-white">
          <span className="absolute h-fit max-h-full truncate text-xl opacity-30">
            {artist}
          </span>
          <div className="truncate">{title}</div>
          <div className="truncate text-xs font-normal">
            Top listened this month
          </div>
        </div>
      </div>
      {image ? (
        <>
          <Image
            src={image}
            alt={`${title} cover art`}
            className="absolute -bottom-10 -left-14 z-0 scale-110 rounded-full opacity-90 blur-3xl"
            width={200}
            height={200}
          />
          <Image
            src={image}
            alt={`${title} cover art`}
            className="absolute -bottom-10 -left-14 z-[1] animate-spin overflow-hidden rounded-full drop-shadow-[0_0_30px_rgba(255,255,255,0.55)] animate-duration-[65s]"
            placeholder="empty"
            width={200}
            height={200}
          />
        </>
      ) : (
        <>
          <Image
            src={DISC_PLACEHOLDER}
            alt="vinyl disc placeholder"
            className="absolute -bottom-10 -left-14 z-0 scale-110 rounded-full opacity-90 blur-3xl"
            width={200}
            height={200}
            unoptimized
          />
          <Image
            src={DISC_PLACEHOLDER}
            alt="vinyl disc placeholder"
            className="absolute -bottom-10 -left-14 z-[1] animate-spin overflow-hidden rounded-full drop-shadow-[0_0_30px_rgba(255,255,255,0.55)] animate-duration-[65s]"
            placeholder="empty"
            width={200}
            height={200}
            unoptimized
          />
        </>
      )}
    </a>
  )
}
