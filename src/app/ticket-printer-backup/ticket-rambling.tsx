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
    result += CHARSET[Math.floor(Math.random() * 36)] // Only A-Z, 0-9 for final id
  }
  return result
}

export function TicketRamblingId({ length = 10, duration = 2000, onDone }) {
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
        let revealed = Math.floor((frame / totalFrames) * length)
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
    return () => clearInterval(interval)
  }, [length, duration, onDone])

  return (
    <span style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
      {display}
    </span>
  )
}
