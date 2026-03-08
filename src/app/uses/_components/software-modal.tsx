'use client'

import Image from 'next/image'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowSquareOut, X } from '@phosphor-icons/react'
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
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-sm translate-x-[-50%] translate-y-[-50%] duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
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

            {/* Content */}
            <div className="flex flex-col items-center p-6 pt-8 text-center">
              {/* App Icon */}
              <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-[18px] border border-neutral-200 shadow-sm dark:border-neutral-700">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              {/* App Name */}
              <Dialog.Title className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {item.name}
              </Dialog.Title>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap justify-center gap-1.5">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <Dialog.Description className="mb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {item.description}
              </Dialog.Description>

              {/* Action Button */}
              {item.url && (
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-300 hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
                >
                  <ArrowSquareOut size={16} weight="bold" />
                  Open Website
                </Link>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
