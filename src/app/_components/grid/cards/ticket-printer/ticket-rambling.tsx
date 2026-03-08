'use client'

import { useEffect, useRef, useState } from 'react'

// Technical name: Decoding Text Animation (also called Hacker Text, Scramble, or Cipher effect)
// This component animates a string by flipping through random characters and lands on a final value.

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?'

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)]
}

function randomId(length = 10) {
  let result = ''
  for (let i = 0; i < length; i++) {
    // Only A-Z, 0-9 for final id
    result += CHARSET[Math.floor(Math.random() * 36)]
  }
  return result
}

interface TicketRamblingIdProps {
  length?: number
  duration?: number
  onDone?: (id: string) => void
}

export function TicketRamblingId({
  length = 10,
  duration = 2000,
  onDone
}: TicketRamblingIdProps) {
  const [display, setDisplay] = useState(''.padEnd(length, ' '))
  const [done, setDone] = useState(false)
  const finalId = useRef(randomId(length))

  useEffect(() => {
    let frame = 0
    let interval: NodeJS.Timeout
    const totalFrames = Math.floor(duration / 40)

    function animate() {
      if (frame < totalFrames) {
        // Gradually reveal the finalId
        const revealed = Math.floor((frame / totalFrames) * length)
        let chars = ''

        for (let i = 0; i < length; i++) {
          if (i < revealed) {
            chars += finalId.current[i]
          } else {
            chars += randomChar()
          }
        }

        setDisplay(chars)
        frame++
      } else {
        setDisplay(finalId.current)
        setDone(true)
        if (onDone) onDone(finalId.current)
        clearInterval(interval)
      }
    }

    interval = setInterval(animate, 40)

    return () => {
      clearInterval(interval)
    }
  }, [length, duration, onDone])

  return (
    <span style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
      {display}
    </span>
  )
}

interface RambleProps {
  children: string
  /**
   * Approximate speed of the animation; lower is faster.
   * If `duration` is provided, it takes precedence.
   */
  speed?: number
  /**
   * Total duration of the scramble animation in ms.
   */
  duration?: number
}

/**
 * Ramble
 * Scrambles characters and gradually reveals the final text.
 * Used for labels like "Date:", "Time:" etc.
 */
export default function Ramble({
  children,
  speed = 50,
  duration
}: RambleProps) {
  const text = String(children)
  const [display, setDisplay] = useState(() => ''.padEnd(text.length, ' '))

  useEffect(() => {
    const baseDuration = duration ?? Math.max(600, text.length * speed)
    const frameInterval = 40
    const totalFrames = Math.max(1, Math.floor(baseDuration / frameInterval))

    let frame = 0
    let interval: NodeJS.Timeout

    function animate() {
      if (frame < totalFrames) {
        const revealed = Math.floor((frame / totalFrames) * text.length)
        let chars = ''

        for (let i = 0; i < text.length; i++) {
          if (i < revealed) {
            chars += text[i]
          } else {
            chars += randomChar()
          }
        }

        setDisplay(chars)
        frame++
      } else {
        setDisplay(text)
        clearInterval(interval)
      }
    }

    interval = setInterval(animate, frameInterval)

    return () => {
      clearInterval(interval)
    }
  }, [text, speed, duration])

  return (
    <span style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
      {display}
    </span>
  )
}
