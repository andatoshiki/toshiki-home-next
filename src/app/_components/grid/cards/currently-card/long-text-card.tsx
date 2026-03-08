import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Television } from '@phosphor-icons/react/dist/ssr'
import { getCurrentMedia } from './get-current-media'

export function LongTextCard() {
  const media = getCurrentMedia()

  if (!media) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-neutral-200 bg-white p-5 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
        Nothing currently watching or reading
      </div>
    )
  }

  const progressText = media.total
    ? `${media.progress}/${media.total}`
    : `${media.progress}`

  const statusLabel = media.type === 'anime' ? 'Watching' : 'Reading'
  const Icon = media.type === 'anime' ? Television : BookOpen

  return (
    <Link
      href={media.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full w-full items-stretch overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-500 hover:scale-[.97] dark:border-neutral-800 dark:bg-neutral-950"
    >
      {/* Cover Image - spans full height */}
      <div className="relative h-full w-28 flex-shrink-0">
        <Image
          src={media.coverImage}
          alt={media.title}
          fill
          className="object-cover"
          sizes="112px"
          priority
        />
        {/* Gradient fade to background - smooth transition */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent via-white/50 to-white dark:via-neutral-950/50 dark:to-neutral-950" />
      </div>

      {/* Content - positioned to avoid overlap */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between py-3 pl-2 pr-4">
        {/* Top section */}
        <div className="space-y-1.5">
          {/* Status badge */}
          <div className="flex items-center gap-1.5">
            <Icon
              size={12}
              weight="fill"
              className="text-neutral-500 dark:text-neutral-400"
            />
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Currently {statusLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-1 text-sm font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
            {media.title}
          </h3>

          {/* Description */}
          {media.description && (
            <p className="line-clamp-2 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {media.description}
            </p>
          )}
        </div>

        {/* Bottom section */}
        <div className="flex items-end justify-between gap-2">
          {/* Progress */}
          <div className="space-y-1">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {media.type === 'anime' ? 'Episode' : 'Chapter'} {progressText}
            </div>
            {/* Progress bar */}
            {media.total && (
              <div className="h-1 w-16 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-full rounded-full bg-neutral-600 transition-all dark:bg-neutral-400"
                  style={{
                    width: `${Math.min((media.progress / media.total) * 100, 100)}%`
                  }}
                />
              </div>
            )}
          </div>

          {/* Format badge */}
          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {media.format}
          </span>
        </div>
      </div>
    </Link>
  )
}
