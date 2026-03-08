interface PerforatedEdgeProps {
  position: 'top' | 'bottom'
}

export function PerforatedEdge({ position }: PerforatedEdgeProps) {
  const isTop = position === 'top'
  const roundedClass = isTop ? 'rounded-t-sm' : 'rounded-b-sm'

  return (
    <div
      className={`relative h-2 bg-gradient-to-b ${
        isTop
          ? 'from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900'
          : 'from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800'
      } ${roundedClass}`}
    >
      {/* Perforation holes */}
      <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-center gap-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700"
          />
        ))}
      </div>
    </div>
  )
}
