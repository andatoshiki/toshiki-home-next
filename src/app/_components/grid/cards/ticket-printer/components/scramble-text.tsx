'use client'

import React, { useEffect, useRef, useState } from 'react'

const CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=<>?'

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)]
}

function randomId(length = 10) {
  let result = ''
  const idCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let i = 0; i < length; i++) {
    result += idCharset[Math.floor(Math.random() * idCharset.length)]
  }
  return result
}

interface ScrambleTextProps {
  children?: React.ReactNode
  length?: number // For ID mode: fixed length
  duration?: number
  onDone?: (result?: string) => void
  mode?: 'scramble' | 'progressive' // scramble: all at once, progressive: left to right
  className?: string
}

/**
 * Unified scramble text component
 * - scramble mode: Scrambles random chars then reveals full text (for receipt data)
 * - progressive mode: Progressively reveals characters from left to right (for LCD ID)
 */
export function ScrambleText({
  children,
  length,
  duration = 2000,
  onDone,
  mode = 'scramble',
  className
}: ScrambleTextProps) {
  const str =
    typeof children === 'string'
      ? children
      : React.Children.toArray(children).join('')

  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)
  const scrambleRef = useRef<NodeJS.Timeout | null>(null)
  const finalId = useRef<string | null>(null)

  useEffect(() => {
    setDone(false)

    if (mode === 'progressive' && length) {
      // Progressive mode: generate ID and reveal character by character
      const idLength = length
      finalId.current = randomId(idLength)
      setDisplay(''.padEnd(idLength, ' '))

      let frame = 0
      let timeout: NodeJS.Timeout
      const totalFrames = Math.floor(duration / 40)

      function animate() {
        if (frame < totalFrames) {
          const revealed = Math.floor((frame / totalFrames) * idLength)
          let chars = ''
          for (let i = 0; i < idLength; i++) {
            if (i < revealed) {
              chars += finalId.current![i]
            } else {
              chars += randomChar()
            }
          }
          setDisplay(chars)
          frame++
          const minDelay = 20
          const maxDelay = 120
          const progress = frame / totalFrames
          const delay = minDelay + (maxDelay - minDelay) * progress
          timeout = setTimeout(animate, delay)
        } else {
          setDisplay(finalId.current!)
          setDone(true)
          if (onDone) onDone(finalId.current!)
        }
      }
      animate()
      return () => clearTimeout(timeout)
    } else {
      // Scramble mode: scramble all then reveal
      const rambleLen = Math.max(0, str.length)
      setDisplay(' '.repeat(rambleLen))
      let frame = 0
      const scrambleFrames = Math.max(10, Math.floor(duration / 40))

      function scramble() {
        if (frame < scrambleFrames) {
          let chars = ''
          for (let i = 0; i < rambleLen; i++) {
            chars += randomChar()
          }
          setDisplay(chars)
          frame++
          scrambleRef.current = setTimeout(scramble, 40)
        } else {
          setDisplay(str)
          setDone(true)
          if (onDone) onDone()
        }
      }
      scramble()
      return () => {
        if (scrambleRef.current) clearTimeout(scrambleRef.current)
      }
    }
  }, [str, length, duration, onDone, mode])

  const content = (
    <>
      {display}
      {!done && mode === 'scramble' && (
        <span className="inline-block w-2 animate-pulse">|</span>
      )}
    </>
  )

  if (mode === 'progressive') {
    return (
      <span
        className={className}
        style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}
      >
        {content}
      </span>
    )
  }

  return <>{content}</>
}

// Export default for backward compatibility
export default ScrambleText
