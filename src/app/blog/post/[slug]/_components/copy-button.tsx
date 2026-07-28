'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from '@phosphor-icons/react/dist/ssr'

type CopyStatus = 'idle' | 'copied' | 'error'

export function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isCopied = status === 'copied'

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    },
    []
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
      resetTimerRef.current = setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      resetTimerRef.current = setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={isCopied}
        onClick={copy}
        aria-label={isCopied ? 'Code copied' : 'Copy code'}
        className={`absolute bottom-0 right-0 flex items-center gap-1 rounded-tl-lg p-2 leading-none transition-[background-color,color,opacity] duration-200 ease-out hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-500 active:opacity-100 motion-reduce:transition-none dark:focus-visible:ring-neutral-400 ${
          isCopied
            ? 'bg-green-100/40 text-green-800 opacity-100 dark:bg-green-300/10 dark:text-green-500'
            : 'cursor-pointer bg-neutral-300 text-neutral-600 opacity-40 hover:bg-neutral-200 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300'
        }`}
      >
        {isCopied ? (
          <Check aria-hidden="true" size="1em" />
        ) : (
          <Copy aria-hidden="true" size="1em" />
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {status === 'copied'
          ? 'Code copied to clipboard.'
          : status === 'error'
            ? 'Could not copy code. Select and copy it manually.'
            : ''}
      </span>
    </>
  )
}
