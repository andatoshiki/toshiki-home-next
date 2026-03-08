'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowCounterClockwise } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { ERROR_MESSAGES, type ErrorCode } from './error-messages'
import { Title } from '~/components/title'

interface ErrorCardProps {
  statusCode: number
  title?: string
  description?: string
  error?: any
  reset?: () => void
}

export function ErrorCard({
  statusCode,
  title,
  description,
  error,
  reset
}: ErrorCardProps) {
  const router = useRouter()

  const errorMeta = ERROR_MESSAGES[
    statusCode as keyof typeof ERROR_MESSAGES
  ] || {
    title: title || 'Unknown Error',
    description: description || 'An unknown error occurred.'
  }

  const handleRefresh = () => {
    if (reset) {
      reset()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="content-container m-auto space-y-10 py-8">
      <div className="space-y-2">
        {/* <h1 className="text-2xl font-semibold text-black/90 dark:text-white/90">
          An error occurred
        </h1> */}
        <Title text="An error occurred" />
        <p className="text-lg text-black/50 dark:text-white/30">
          Here are the details:
        </p>
      </div>

      <div className="bg-neutral-250 flex flex-col gap-6 rounded-3xl border border-neutral-200 p-5 dark:border-neutral-800 dark:bg-neutral-950 md:flex-row md:p-7">
        <div className="w-full flex-shrink-0 md:w-80">
          <Image
            src={`https://http.toshiki.dev/${statusCode}.png`}
            alt={`Error ${statusCode}`}
            width={320}
            height={320}
            className="w-full rounded-3xl border border-neutral-200 dark:border-neutral-800"
            unoptimized
          />
        </div>

        <div className="space-y-6 whitespace-normal">
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-neutral-600 dark:text-neutral-400">
              TITLE
            </h3>
            <span className="text-neutral-900 dark:text-neutral-100">
              {errorMeta.title}
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-neutral-600 dark:text-neutral-400">
              DESCRIPTION
            </h3>
            <span className="text-neutral-900 dark:text-neutral-100">
              {errorMeta.description}
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-neutral-600 dark:text-neutral-400">
              DETAILS
            </h3>
            <pre className="overflow-auto whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
              {JSON.stringify(
                {
                  statusCode,
                  message: error?.message || errorMeta.description
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 md:justify-start">
        <button
          onClick={() => router.back()}
          className="bg-neutral-250 flex items-center justify-center gap-3 rounded-xl border border-neutral-200 p-3 leading-none transition-colors hover:bg-neutral-300 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
        <button
          onClick={handleRefresh}
          className="bg-neutral-250 flex items-center justify-center gap-3 rounded-xl border border-neutral-200 p-3 leading-none transition-colors hover:bg-neutral-300 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800"
        >
          <ArrowCounterClockwise size={18} />
          Refresh Page
        </button>
      </div>
    </div>
  )
}
