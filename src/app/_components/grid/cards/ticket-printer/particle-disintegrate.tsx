'use client'

import { useRef, useEffect, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  rotation: number
  rotationSpeed: number
  color: string
}

/**
 * ParticleDisintegrate
 * Breaks the receipt into particles that fall downward using canvas for reliable animation.
 */
export function ParticleDisintegrate({
  trigger,
  onComplete,
  children,
  duration = 2000
}: {
  trigger: boolean
  onComplete?: () => void
  children: React.ReactNode
  duration?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hideChildren, setHideChildren] = useState(false)
  const hasAnimatedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!trigger || !containerRef.current || hasAnimatedRef.current) return

    hasAnimatedRef.current = true
    const container = containerRef.current

    // Find the receipt element
    const receiptEl = container.firstElementChild as HTMLElement
    if (!receiptEl) {
      setHideChildren(true)
      if (onCompleteRef.current) onCompleteRef.current()
      return
    }

    // Get bounds
    const rect = receiptEl.getBoundingClientRect()

    // Create canvas
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

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setHideChildren(true)
      if (onCompleteRef.current) onCompleteRef.current()
      return
    }

    // Store ctx in a const to help TypeScript understand it's not null in the animate function
    const context = ctx

    // Get receipt color
    const style = getComputedStyle(receiptEl)
    const bgColor =
      style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
      style.backgroundColor !== 'transparent'
        ? style.backgroundColor
        : 'rgb(255, 251, 235)'

    // Create particles grid
    const gridX = 20
    const gridY = Math.max(25, Math.round(rect.height / 3))
    const particles: Particle[] = []

    const particleW = rect.width / gridX
    const particleH = rect.height / gridY

    for (let x = 0; x < gridX; x++) {
      for (let y = 0; y < gridY; y++) {
        const posX = rect.left + x * particleW + particleW / 2
        const posY = rect.top + y * particleH + particleH / 2

        // Particles spread outward from center
        const centerX = rect.left + rect.width / 2

        particles.push({
          x: posX,
          y: posY,
          vx: ((posX - centerX) / rect.width) * 4 + (Math.random() - 0.5) * 3,
          vy: -2 + Math.random() * 2 + y * 0.1,
          size: Math.min(particleW, particleH) * (0.8 + Math.random() * 0.4),
          opacity: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          color: bgColor
        })
      }
    }

    // Hide the original receipt immediately
    setHideChildren(true)

    // Animation loop
    const startTime = Date.now()
    let animationId: number

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      let hasVisibleParticles = false

      for (const particle of particles) {
        // Apply gravity
        particle.vy += 0.5

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Update rotation
        particle.rotation += particle.rotationSpeed

        // Fade out over time
        particle.opacity = Math.max(0, 1 - progress * 1.2)

        // Shrink particles
        const currentSize = particle.size * (1 - progress * 0.5)

        if (particle.opacity > 0 && particle.y < canvas.height + 50) {
          hasVisibleParticles = true

          context.save()
          context.translate(particle.x, particle.y)
          context.rotate(particle.rotation)
          context.globalAlpha = particle.opacity
          context.fillStyle = particle.color
          context.fillRect(
            -currentSize / 2,
            -currentSize / 2,
            currentSize,
            currentSize
          )
          context.restore()
        }
      }

      if (hasVisibleParticles && progress < 1) {
        animationId = requestAnimationFrame(animate)
      } else {
        // Animation complete - cleanup
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
        if (onCompleteRef.current) onCompleteRef.current()
      }
    }

    // Start animation
    animationId = requestAnimationFrame(animate)

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId)
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [trigger, duration])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'inline-block',
        visibility: hideChildren ? 'hidden' : 'visible'
      }}
    >
      {children}
    </div>
  )
}
