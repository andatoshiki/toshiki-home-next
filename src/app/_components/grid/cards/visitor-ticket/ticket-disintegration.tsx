import { useEffect, RefObject } from 'react'

interface TicketDisintegrationProps {
  trigger: boolean
  slotRef: RefObject<HTMLDivElement>
  onComplete: () => void
}

export function TicketDisintegration({
  trigger,
  slotRef,
  onComplete
}: TicketDisintegrationProps) {
  useEffect(() => {
    if (!trigger) return

    const ticketElement = document.querySelector(
      '[data-ticket="true"]'
    ) as HTMLElement
    if (!ticketElement || !slotRef.current) {
      onComplete()
      return
    }

    const ticketRect = ticketElement.getBoundingClientRect()
    const slotRect = slotRef.current.getBoundingClientRect()
    const slotY = slotRect.top + slotRect.height / 2

    // Get ticket color
    const bgColor =
      getComputedStyle(ticketElement).backgroundColor || 'rgb(255, 255, 255)'

    // Create paper shred effect - vertical strips
    const stripWidth = 3
    const numStrips = Math.ceil(ticketRect.width / stripWidth)
    const strips: HTMLDivElement[] = []

    // Hide original ticket
    ticketElement.style.opacity = '0'
    ticketElement.style.pointerEvents = 'none'

    // Create strips
    for (let i = 0; i < numStrips; i++) {
      const strip = document.createElement('div')
      const x = ticketRect.left + i * stripWidth
      const width = Math.min(stripWidth, ticketRect.right - x)

      strip.style.position = 'fixed'
      strip.style.left = `${x}px`
      strip.style.top = `${ticketRect.top}px`
      strip.style.width = `${width}px`
      strip.style.height = `${ticketRect.height}px`
      strip.style.background = bgColor
      strip.style.pointerEvents = 'none'
      strip.style.zIndex = '9999'
      strip.style.clipPath = `inset(0 0 0 0)`

      document.body.appendChild(strip)
      strips.push(strip)
    }

    // Animate strips falling and shredding
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        strips.forEach((strip, index) => {
          const delay = (index % 5) * 20 // Stagger strips
          const horizontalDrift = (Math.random() - 0.5) * 40
          const rotation = (Math.random() - 0.5) * 15
          const fallDistance = 200 + Math.random() * 100

          setTimeout(() => {
            // Shred effect - clip from top to bottom
            strip.style.transition =
              'clip-path 0.8s ease-in, transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease-out'
            strip.style.clipPath = 'inset(100% 0 0 0)'
            strip.style.transform = `translate(${horizontalDrift}px, ${fallDistance}px) rotate(${rotation}deg)`
            strip.style.opacity = '0'
          }, delay)
        })
      })
    })

    // Cleanup
    const cleanup = setTimeout(() => {
      strips.forEach(strip => {
        if (strip.parentNode) {
          strip.parentNode.removeChild(strip)
        }
      })
      onComplete()
    }, 2000)

    return () => {
      clearTimeout(cleanup)
      strips.forEach(strip => {
        if (strip.parentNode) {
          strip.parentNode.removeChild(strip)
        }
      })
    }
  }, [trigger, slotRef, onComplete])

  return null
}
