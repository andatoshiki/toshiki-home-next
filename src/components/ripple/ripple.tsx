import { type CSSProperties } from 'react'
import { cn } from '../../../lib/utils/style'

const NUM_CIRCLES = 6
const MAIN_CIRCLE_SIZE = 100
const MAIN_CIRCLE_OPACITY = 0.24
const CIRCLE_GAP = 70

interface RippleProps {
  numCircles?: number
  mainCircleSize?: number
  mainCircleOpacity?: number
  circleGap?: number
  className?: string
}

export function Ripple({
  numCircles = NUM_CIRCLES,
  mainCircleSize = MAIN_CIRCLE_SIZE,
  mainCircleOpacity = MAIN_CIRCLE_OPACITY,
  circleGap = CIRCLE_GAP,
  className
}: RippleProps) {
  const getStyle = (i: number): CSSProperties => ({
    width: mainCircleSize + i * circleGap,
    height: mainCircleSize + i * circleGap,
    opacity: mainCircleOpacity - i * 0.03,
    animationDelay: `${i * 0.06}s`
  })

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {Array.from({ length: numCircles }, (_, i) => (
        <div
          key={i}
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/80',
            className
          )}
          style={{
            ...getStyle(i),
            animation: 'var(--animate-ripple)'
          }}
        ></div>
      ))}
    </div>
  )
}
