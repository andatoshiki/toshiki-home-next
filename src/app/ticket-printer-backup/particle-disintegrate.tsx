import { useRef, useEffect, useState } from 'react'

/**
 * ParticleDisintegrate
 * Usage: <ParticleDisintegrate trigger={shouldDisintegrate} onComplete={...} gridX={...} gridY={...} duration={...}>
 * - trigger: boolean, starts disintegration
 * - onComplete: callback after animation
 * - gridX, gridY: number of particles horizontally/vertically (optional)
 * - duration: animation duration in ms (optional)
 * When trigger becomes true, the content breaks into particles and fades out, inheriting color and adapting to current size.
 */
export function ParticleDisintegrate({
  trigger,
  onComplete,
  children,
  gridX = 28,
  gridY = 36,
  duration = 1200
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDisintegrated, setIsDisintegrated] = useState(false)

  useEffect(() => {
    if (!trigger || !containerRef.current || isDisintegrated) return
    const el = containerRef.current
    el.style.position = 'relative'
    // Get current size at the moment of disintegration
    const rect = el.getBoundingClientRect()
    const particles = []
    // Get color from the object (background or text)
    let color = 'rgba(160,120,60,0.85)'
    const firstChild = el.children[0]
    if (firstChild) {
      const style = getComputedStyle(firstChild)
      color =
        style.backgroundColor !== 'rgba(0, 0, 0, 0)'
          ? style.backgroundColor
          : style.color
    }
    const particleW = rect.width / gridX
    const particleH = rect.height / gridY
    // Hide children
    Array.from(el.children).forEach(child => {
      ;(child as HTMLElement).style.opacity = '0'
    })
    // Create grid particles
    for (let x = 0; x < gridX; x++) {
      for (let y = 0; y < gridY; y++) {
        const p = document.createElement('div')
        p.style.position = 'absolute'
        p.style.left = `${x * particleW}px`
        p.style.top = `${y * particleH}px`
        p.style.width = `${particleW}px`
        p.style.height = `${particleH}px`
        p.style.background = color
        p.style.borderRadius = '2px'
        p.style.pointerEvents = 'none'
        p.style.transition = `transform ${duration / 1000}s cubic-bezier(.7,.2,.3,1), opacity ${duration / 1000}s, width ${duration / 1000}s, height ${duration / 1000}s`
        el.appendChild(p)
        particles.push(p)
      }
    }
    // Animate particles: fall, fade out, and get finer
    setTimeout(() => {
      particles.forEach(p => {
        const dx = (Math.random() - 0.5) * 30
        const dy = 60 + Math.random() * 60
        p.style.transform = `translate(${dx}px, ${dy}px)`
        p.style.opacity = '0'
        p.style.width = `${particleW * 0.3}px`
        p.style.height = `${particleH * 0.3}px`
      })
    }, 30)
    // Cleanup
    setTimeout(() => {
      particles.forEach(p => el.removeChild(p))
      setIsDisintegrated(true)
      if (onComplete) onComplete()
    }, duration)
  }, [trigger, onComplete, isDisintegrated, gridX, gridY, duration])

  // Only render children if not disintegrated
  return (
    <div ref={containerRef} style={{ display: 'inline-block' }}>
      {!isDisintegrated && children}
    </div>
  )
}
