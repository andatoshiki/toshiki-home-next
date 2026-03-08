import React from 'react'

export function LoadingSongs() {
  return (
    <div className="content-container m-auto space-y-12">
      {/* Title skeleton */}
      <div className="flex flex-col items-center md:items-start">
        <div className="h-10 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Details skeleton */}
      <section className="space-y-4">
        <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between space-x-4"
            >
              <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </div>
      </section>

      {/* Cards skeleton */}
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="flex h-28 items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <div className="h-12 w-12 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex flex-1 flex-col space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
