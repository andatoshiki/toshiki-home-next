'use client'

import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from '@phosphor-icons/react'
import { LinkV2 } from '~/components/ui/link-v2'
import { UsesEntry } from '.velite'

interface SoftwareModalProps {
  item: UsesEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SoftwareModal({
  item,
  open,
  onOpenChange
}: SoftwareModalProps) {
  if (!item) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Card */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            {/* Close Button */}
            <Dialog.Close asChild>
              <button
                className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                aria-label="Close"
              >
                <X size={16} weight="bold" />
              </button>
            </Dialog.Close>

            {/* Content - Vertical on mobile, Horizontal on larger screens */}
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:gap-5">
              {/* App Icon */}
              <div className="relative mx-auto h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl sm:mx-0 sm:h-36 sm:w-36 md:h-40 md:w-40">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>

              {/* App Details */}
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:justify-between sm:py-0.5">
                {/* App Name */}
                <Dialog.Title asChild>
                  <div className="flex justify-center sm:justify-start">
                    {item.url ? (
                      <LinkV2
                        href={item.url}
                        label={item.name}
                        className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
                      />
                    ) : (
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.name}
                      </h2>
                    )}
                  </div>
                </Dialog.Title>

                {/* Description */}
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                    Description
                  </span>
                  <Dialog.Description className="line-clamp-2 text-sm leading-snug text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </Dialog.Description>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                      Tags
                    </span>
                    <div className="flex flex-wrap justify-center gap-1 sm:justify-start">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
