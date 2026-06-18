'use client'

import { useRef, useEffect } from 'react'

/**
 * PeelOff
 * Peels the receipt away with a diagonal animation sweeping from the
 * bottom-right corner toward the top-left.
 *
 * Strategy: CSS clip-path is applied directly to the wrapper div so the
 * real ticket content is always visible inside the remaining region.
 * A fixed canvas overlay draws only the curl shadow at the fold line.
 *
 * Drop-in replacement for ParticleDisintegrate — identical props API.
 */
export function PeelOff({
  trigger,
  onComplete,
  children,
  duration = 1400
}: {
  trigger: boolean
  onComplete?: () => void
  children: React.ReactNode
  duration?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!trigger || !containerRef.current || hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const W = rect.width
    const H = rect.height

    // The ticket's perforated edges (class -top-2 / -bottom-2) overflow the
    // container by exactly 8 px (0.5 rem at 16 px base) at both ends.
    // We must include that overflow in every polygon step so the perforations
    // never vanish and the element doesn't appear to "drop" at t = 0.
    const PERF = 8
    const eTop = -PERF // top of extended rect, relative to container
    const eBottom = H + PERF // bottom of extended rect, relative to container
    const eH = H + 2 * PERF // total height of extended rect

    // Absolute viewport coords for the shadow canvas
    const absLeft = rect.left
    const absTop = rect.top - PERF // = rect.top + eTop
    const absRight = rect.left + W
    const absBottom = rect.top + H + PERF // = rect.top + eBottom

    // Canvas — curl shadow only; ticket content stays in the DOM
    const canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(canvas)
    const context = canvas.getContext('2d')

    const startTime = Date.now()
    let animId: number

    /**
     * CSS clip-path polygon in element-relative px, extended by PERF at top
     * and bottom to cover the overflowing perforated edges.
     *
     * Phase 1 (t ∈ [0, 0.5]):
     *   5-gon { TL, TR, B(right edge), A(bottom edge), BL }
     *   where TL = (0, eTop), TR = (W, eTop), BL = (0, eBottom)
     *
     * Phase 2 (t ∈ (0.5, 1]):
     *   Triangle { TL, C(top edge), D(left edge) }
     *
     * Continuity at t = 0.5 (full diagonal) is maintained.
     */
    function getFlatClipPath(t: number): string {
      if (t <= 0) {
        return `polygon(0px ${eTop}px, ${W}px ${eTop}px, ${W}px ${eBottom}px, 0px ${eBottom}px)`
      }
      if (t >= 1) {
        return 'polygon(0px 0px, 0px 0px, 0px 0px)'
      }
      if (t <= 0.5) {
        // A on bottom edge (x: W→0), B on right edge (y: eBottom→eTop)
        const ax = (W * (1 - 2 * t)).toFixed(2)
        const by = (eTop + eH * (1 - 2 * t)).toFixed(2)
        return `polygon(0px ${eTop}px, ${W}px ${eTop}px, ${W}px ${by}px, ${ax}px ${eBottom}px, 0px ${eBottom}px)`
      } else {
        // C on top edge (x: W→0), D on left edge (y: eBottom→eTop)
        const cx = (W * (2 - 2 * t)).toFixed(2)
        const dy = (eTop + eH * (2 - 2 * t)).toFixed(2)
        return `polygon(0px ${eTop}px, ${cx}px ${eTop}px, 0px ${dy}px)`
      }
    }

    /**
     * Draws three things on the canvas each frame:
     *  1. A dark shadow gradient in the peeled area (lifted-paper shadow on background).
     *  2. A narrow warm+white highlight strip right at the fold crease.
     *  3. The fold crease shadow cast on the remaining flat region.
     */
    function drawShadow(t: number) {
      if (!context) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      if (t <= 0 || t >= 1) return

      let p1: [number, number], p2: [number, number]
      let flatPoly: [number, number][]
      let peelPoly: [number, number][]

      if (t <= 0.5) {
        const ax = absLeft + W * (1 - 2 * t)
        const by = absTop + eH * (1 - 2 * t)
        p1 = [ax, absBottom]
        p2 = [absRight, by]
        flatPoly = [
          [absLeft, absTop],
          [absRight, absTop],
          p2,
          p1,
          [absLeft, absBottom]
        ]
        peelPoly = [[absRight, absBottom], p1, p2]
      } else {
        const cx = absLeft + W * (2 - 2 * t)
        const dy = absTop + eH * (2 - 2 * t)
        p1 = [cx, absTop]
        p2 = [absLeft, dy]
        flatPoly = [[absLeft, absTop], p1, p2]
        peelPoly = [
          p1,
          [absRight, absTop],
          [absRight, absBottom],
          [absLeft, absBottom],
          p2
        ]
      }

      const fmx = (p1[0] + p2[0]) / 2
      const fmy = (p1[1] + p2[1]) / 2
      // Direction from fold midpoint toward the far corner (into peeled area)
      const awayX = absRight - fmx
      const awayY = absBottom - fmy
      const awayLen = Math.sqrt(awayX * awayX + awayY * awayY) || 1

      function tracePeelPoly() {
        context!.beginPath()
        context!.moveTo(peelPoly[0][0], peelPoly[0][1])
        for (let i = 1; i < peelPoly.length; i++)
          context!.lineTo(peelPoly[i][0], peelPoly[i][1])
        context!.closePath()
      }

      // --- 1. Drop shadow in peeled area ---
      // Simulates the shadow cast by the lifted corner onto the background.
      // No fill color — just a dark gradient that fades out, so the real background shows.
      const dropDepth = Math.min(W, eH) * 0.55
      const dropGrad = context.createLinearGradient(
        fmx,
        fmy,
        fmx + (awayX / awayLen) * dropDepth,
        fmy + (awayY / awayLen) * dropDepth
      )
      dropGrad.addColorStop(0, 'rgba(0,0,0,0.20)')
      dropGrad.addColorStop(1, 'rgba(0,0,0,0)')
      context.save()
      tracePeelPoly()
      context.clip()
      context.fillStyle = dropGrad
      context.fill()
      context.restore()

      // --- 2. Narrow back-of-paper strip at the fold crease ---
      // White highlight (bend) + brief warm paper color, fades to transparent quickly.
      const stripDepth = Math.min(W, eH) * 0.13
      const stripGrad = context.createLinearGradient(
        fmx,
        fmy,
        fmx + (awayX / awayLen) * stripDepth,
        fmy + (awayY / awayLen) * stripDepth
      )
      stripGrad.addColorStop(0, 'rgba(255,255,255,0.60)')
      stripGrad.addColorStop(0.35, 'rgba(238,225,190,0.70)')
      stripGrad.addColorStop(1, 'rgba(238,225,190,0)')
      context.save()
      tracePeelPoly()
      context.clip()
      context.strokeStyle = stripGrad
      context.lineWidth = stripDepth * 2
      context.lineCap = 'round'
      context.beginPath()
      context.moveTo(p1[0], p1[1])
      context.lineTo(p2[0], p2[1])
      context.stroke()
      context.restore()

      // --- 3. Fold crease shadow on the flat (unpeeled) region ---
      const inX = absLeft - fmx
      const inY = absTop - fmy
      const inLen = Math.sqrt(inX * inX + inY * inY) || 1
      const depth = Math.min(W, eH) * 0.22
      const foldGrad = context.createLinearGradient(
        fmx,
        fmy,
        fmx + (inX / inLen) * depth,
        fmy + (inY / inLen) * depth
      )
      foldGrad.addColorStop(0, 'rgba(0,0,0,0.38)')
      foldGrad.addColorStop(0.45, 'rgba(0,0,0,0.08)')
      foldGrad.addColorStop(1, 'rgba(0,0,0,0)')
      context.save()
      context.beginPath()
      context.moveTo(flatPoly[0][0], flatPoly[0][1])
      for (let i = 1; i < flatPoly.length; i++)
        context.lineTo(flatPoly[i][0], flatPoly[i][1])
      context.closePath()
      context.clip()
      context.strokeStyle = foldGrad
      context.lineWidth = depth * 2
      context.lineCap = 'round'
      context.beginPath()
      context.moveTo(p1[0], p1[1])
      context.lineTo(p2[0], p2[1])
      context.stroke()
      context.restore()
    }

    function animate() {
      const elapsed = Date.now() - startTime
      const raw = Math.min(elapsed / duration, 1)

      // Ease-in-out
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2

      // Mutate the DOM node directly — no React re-render per frame
      if (containerRef.current) {
        containerRef.current.style.clipPath = getFlatClipPath(t)
      }
      drawShadow(t)

      if (raw < 1) {
        animId = requestAnimationFrame(animate)
      } else {
        if (containerRef.current) {
          containerRef.current.style.visibility = 'hidden'
        }
        canvas.parentNode?.removeChild(canvas)
        onCompleteRef.current?.()
      }
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      canvas.parentNode?.removeChild(canvas)
    }
  }, [trigger, duration])

  return (
    <div ref={containerRef} style={{ display: 'inline-block' }}>
      {children}
    </div>
  )
}
